const contentMap = {
    users: `
      <div class="user-table">
        <div class="user-table-header">
          <span>Username</span>
          <span>Email</span>
          <span>Action</span>
        </div>
        <div class="user-table-row">
          <span>Usuario</span>
          <span>Gmail.com</span>
          <button class="view-btn">View Purchases</button>
        </div>
        <div class="user-table-row">
          <span>Usuario</span>
          <span>Gmail.com</span>
          <button class="view-btn">View Purchases</button>
        </div>
        <div class="user-table-row">
          <span>Usuario</span>
          <span>Gmail.com</span>
          <button class="view-btn">View Purchases</button>
        </div>
        <div class="search-icon">🔍</div>
      </div>
    `
  };
  
  const buttons = document.querySelectorAll('.dropbtn');
  const mainContent = document.querySelector('.main-content');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      if (contentMap[section]) {
        mainContent.innerHTML = contentMap[section];
      }
    });
  });
  