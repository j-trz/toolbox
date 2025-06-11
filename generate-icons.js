const fs = require('fs');
const path = require('path');

const iconsFolderPath = path.join(__dirname, 'icons',);
const outputPath = path.join(__dirname, 'src', 'libs', 'icons.js');

console.log('Iniciando la lectura de iconos...');

fs.readdir(iconsFolderPath, (err, files) => {
    if (err) {
        console.error('Error: No se pudo leer la carpeta de iconos.', err);
        return;
    }

    const svgFiles = files.filter(file => path.extname(file) === '.svg');
    const allIcons = [];

    svgFiles.forEach(file => {
        const filePath = path.join(iconsFolderPath, file);
        let svgContent = fs.readFileSync(filePath, 'utf-8');
        
        // **NUEVO:** Extraemos el nombre del archivo sin la extensión .svg
        const iconName = path.basename(file, '.svg');

        svgContent = svgContent.replace(/ class="[^"]*"/g, '');
        svgContent = svgContent.replace(/ width="[^"]*"/g, ' width="24"');
        svgContent = svgContent.replace(/ height="[^"]*"/g, ' height="24"');

        // **NUEVO:** Guardamos un objeto con el nombre y el SVG
        allIcons.push(`{ name: '${iconName}', svg: \`${svgContent}\` }`);
    });

    const fileContent = `// Este archivo es autogenerado. No lo edites manualmente.\n// Total de iconos: ${allIcons.length}\n\nexport const ICONS_SVG = [\n    ${allIcons.join(',\n    ')}\n];`;

    fs.writeFile(outputPath, fileContent, 'utf-8', (err) => {
        if (err) {
            console.error('Error: No se pudo escribir el archivo de salida.', err);
            return;
        }
        console.log(`¡Éxito! Se ha creado el archivo icons.js con ${allIcons.length} iconos en ${outputPath}`);
    });
});