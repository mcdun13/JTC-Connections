/**
 * Simple Header Component
 * Usage: createHeader(logoSrc, logoLink, navLinks)
 */

function createHeader(logoSrc, logoLink, navLinks = []) {
    const header = document.createElement('header');
    
    // Create logo
    const logoA = document.createElement('a');
    logoA.href = logoLink;
    logoA.className = 'logo';
    
    const logoImg = document.createElement('img');
    logoImg.src = logoSrc;
    logoImg.alt = 'Logo';
    
    logoA.appendChild(logoImg);
    header.appendChild(logoA);
    
    // Create nav only if there are links
    if (navLinks.length < 10) {
      const nav = document.createElement('nav');
      
      navLinks.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        nav.appendChild(a);
      });
      
      header.appendChild(nav);
    }
    
    // Insert at top of body
    document.body.insertBefore(header, document.body.firstChild);
    
    // Add styles
    addHeaderStyles();
  }
  
  function addHeaderStyles() {
    if (document.getElementById('header-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'header-styles';
    style.textContent = `
      header {
      display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 1rem 1rem;
        background-color: #ffffff;
        
      }
      
      header .logo img {
        height: 75px;
        width: auto;
        align: left;
      }
      
      header nav {
        display: flex;
        gap: 2rem;
      }
      
      header nav a {
        text-decoration: none;
        color: #333;
        font-weight: 500;
        hover {
  text-decoration: underline;
}

      }
      
      header nav a:hover {
     
      }
    `;
    
    document.head.appendChild(style);
  }