document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menuButton');
    const menuDropdown = document.getElementById('menuDropdown');
    const downIcon = document.getElementById('downIcon');
    const rightIcon = document.getElementById('rightIcon');

    const menuButtonSrv = document.getElementById('menuButtonSrv');
    const menuDropdownSrv = document.getElementById('menuDropdownSrv');
    const downIconSrv = document.getElementById('downIconSrv');
    const rightIconSrv = document.getElementById('rightIconSrv');
  
    menuButton.addEventListener('click', function () {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      
      menuButton.setAttribute('aria-expanded', !isExpanded);
      menuDropdown.classList.toggle('hidden');
  
      if (!isExpanded) {
        menuDropdown.classList.remove('opacity-0', 'translate-y-1');
        menuDropdown.classList.add('opacity-100', 'translate-y-0', 'transition', 'ease-out', 'duration-200');
        downIcon.classList.remove('hidden');
        rightIcon.classList.add('hidden');
      } else {
        menuDropdown.classList.remove('opacity-100', 'translate-y-0');
        menuDropdown.classList.add('opacity-0', 'translate-y-1', 'transition', 'ease-in', 'duration-150');
        downIcon.classList.add('hidden');
        rightIcon.classList.remove('hidden');
      }
    });
  
    menuButtonSrv.addEventListener('click', function () {
      const isExpanded = menuButtonSrv.getAttribute('aria-expanded') === 'true';
      
      menuButtonSrv.setAttribute('aria-expanded', !isExpanded);
      menuDropdownSrv.classList.toggle('hidden');
  
      if (!isExpanded) {
        menuDropdownSrv.classList.remove('opacity-0', 'translate-y-1');
        menuDropdownSrv.classList.add('opacity-100', 'translate-y-0', 'transition', 'ease-out', 'duration-200');
        downIconSrv.classList.remove('hidden');
        rightIconSrv.classList.add('hidden');
      } else {
        menuDropdownSrv.classList.remove('opacity-100', 'translate-y-0');
        menuDropdownSrv.classList.add('opacity-0', 'translate-y-1', 'transition', 'ease-in', 'duration-150');
        downIconSrv.classList.add('hidden');
        rightIconSrv.classList.remove('hidden');
      }
    });
  
    document.addEventListener('click', function (event) {
      if (!menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuDropdown.classList.add('hidden');
        downIcon.classList.add('hidden');
        rightIcon.classList.remove('hidden');
      }
      if (!menuButtonSrv.contains(event.target) && !menuDropdownSrv.contains(event.target)) {
        menuButtonSrv.setAttribute('aria-expanded', 'false');
        menuDropdownSrv.classList.add('hidden');
        downIconSrv.classList.add('hidden');
        rightIconSrv.classList.remove('hidden');
      }
    });
  
    const previewButton = document.getElementById('preview');
    const agregarEntradasButton = document.getElementById('agregar-entradas');

    if (previewButton) {
      previewButton.addEventListener('click', function () {
        const width = 1000;
        const height = 800;
        const left = 5000;
        const top = 500;
        const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;

        window.open('/gdsCompare.html', 'popupWindow', features);
      });
    }

    if (agregarEntradasButton) {
      agregarEntradasButton.addEventListener('click', function () {
        const width = 1000;
        const height = 800;
        const left = 5000;
        const top = 500;
        const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`;

        window.open('/adminGds.html', 'popupWindow', features);
      });
    }
});


function hideElements() {
    document.querySelectorAll('.container button').forEach(function (button) {
        if (button) {
            button.style.display = 'none';
        }
    });
    document.querySelectorAll('.container ').forEach(function (h1) {
        h1.style.display = 'none';
    });
    document.getElementById('reserva-info').style.display = 'none';
}

function showElements() {
    document.querySelectorAll('.container button').forEach(function (button) {
        if (button) {
            if (isAuthenticated) {
                if (button.id === 'login-button') {
                    button.style.display = 'none';
                } else {
                    button.style.display = 'block';
                }
            } else {
                button.style.display = 'block';
            }
        }
    });
    document.querySelectorAll('.container h1').forEach(function (h1) {
        h1.style.display = 'block';
    });
    document.getElementById('reserva-info').style.display = 'block';
}

function updatePopupMenu() {
  const popupMenu = document.getElementById('menuDropdown');
  popupMenu.innerHTML = menuItems
    .map(
      (item) => `
      <li>
        <a href="${item.link}" class="axs blf big bqe lx aaf adu aqp avz awo awf">
          ${item.icon} ${item.text}
        </a>
      </li>
    `
    )
    .join('');
}



