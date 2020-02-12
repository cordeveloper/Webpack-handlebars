

  class Modal extends HTMLElement {
  
    constructor() {
      super();
      
      this.state = false;
      this.target = '';
      this.root = this.attachShadow({mode: 'open'});
    }
  
    connectedCallback() {

      this.root.innerHTML = `
      <style>
      @font-face {
        font-family: 'Graphik Light Italic';
        src: url('../assets/webfonts/Graphik-LightItalic.eot');
        src: url('../assets/webfonts/Graphik-LightItalic.eot?#iefix') format('embedded-opentype'),
          url('../assets/webfonts/Graphik-LightItalic.woff2') format('woff2'),
          url('../assets/webfonts/Graphik-LightItalic.woff') format('woff'),
          url('../assets/webfonts/Graphik-LightItalic.ttf') format('truetype'),
          url('../assets/webfonts/Graphik-LightItalic.svg#Graphik-LightItalic') format('svg');
        font-weight: normal;
      }
      .overlay {
        background-color: rgba(0,0,0,.3);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
        transition: opacity .3s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .modal{
        background-color: #00b3da;
        position: fixed;
        top: 50%;
        left: 50%;
        border-radius: 30px;
        opacity: 0;
        pointer-events: none;
        transition: all .3s ease-in-out;
        transform: translate(-50%, 40%);
        width: 80%;
        max-width: 1100px;
        box-sizing: border-box;
        padding: 5% 2%;
      }
      .modal__header{
        background-color: #00b3da;
        color: #fff;
        font-family: "Open Sans", sans-serif;
        font-weight: bold;
        text-transform: uppercase; 
        padding: 5px 15px;
        box-sizing: border-box;
        border-radius: 30px 30px 0 0;
        position: relative;
      }
      :sloted([title]){
        margin-right: 15px;
      }
      .modal__main {
        padding: 25px 15px;
        font-family: "Graphik Light Italic", sans-serif;
        color: #fff;
        font-style: normal;
        line-height: normal;
        font-size: 1.1rem;
        width: 80%;
        margin: 0 auto;
        text-align: center;
      
      }
      .modal__title {
        font-size: 1.5rem;
        padding: 25px 0;
      }
   
      .modal__close {
        color: #fff;
        font-family: Georgia, sans-serif;
        font-weight: bold;
        font-size: 2.2rem;
        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
      }
      .modal__footer{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
      }

      :host([opened]) #overlay,
      :host([opened]) #modal
      {
        opacity: 1;
        pointer-events: all;
      }

      *[opened] #overlay,
      *[opened] #modal{
        opacity: 1;
        pointer-events: all;
      }

      :host([opened]) #modal{
        transform: translate(-50%, -50%);
        width: 80%;
      }

    
      *[opened] #modal{
        transform: translate(-50%, -50%);
        width: 80%;
      }



      .btn-confirm,
      .btn-cancel{
        cursor: pointer;
        margin: 0 5px;
        border: none;
        display: inline-block;
        background-color: transparent;
        cursor: pointer;
        border: 2px solid #fff;
        border-radius: 30px;
        padding: .5em 2em;
        color: #fff;
        font-size: 1.4rem;
        overflow: hidden;
        position: relative;
        font-family: Graphik Light Italic, sans-serif;
        font-size: 1rem;
        font-style: italic;
      }
      .btn-confirm:hover,
      .btn-confirm:focus,
      .btn-confirm:active,
      .btn-confirm:visited{
        background-color: #fff;
        color: #d9338a;
        outline: 0;
      }
     </style>
     <section class="overlay" id="overlay"></section>
     <section class="modal" id="modal">
      <main class="modal__main">
        <slot name="content">
          El contenido de la aplicación
        </slot>
      </main>
      <footer class="modal__footer">
        <button class="btn-confirm" id="modal-ok">Voltar</button>
      </footer>
     </section>
    `;

  
  
      this.target = this.getAttribute('name');
      if(!this.target) console.error("NO TARGET!!!");
  
      const confirm = this.shadowRoot.querySelector('#modal-ok');
      const cancel = this.shadowRoot.querySelector('#modal-cancel');
      const overlay = this.shadowRoot.querySelector('#overlay');
      const trigger = document.querySelector(`[data-triggermodal=${this.target}]`);
  
      if(confirm){
        confirm.addEventListener('click', this.close.bind(this));
      }
      if(cancel){
        cancel.addEventListener('click', this.close.bind(this));
      }
      if(trigger){
        trigger.addEventListener('click', this.open.bind(this));
      }
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if(this.hasAttribute('opened')){
        this.status = true;
      } else {
        this.status = false;
      }
    }
  
    static get observedAttributes() {
      return ['opened'];
    }
  
    _show() {
     
      this.state = true;
      this.setAttribute('opened', '');
    }
  
    _hide() {
  
      this.state = false;
      if(this.hasAttribute('opened')){
        this.removeAttribute('opened');
      }
   
    } 
  
    open(event) {
      this._show();
      const confirmEvent = new Event('open');
      this.dispatchEvent(confirmEvent);
    }
  
    close(event) {
      this._hide();
      const cancelEvent = new Event('close', { bubbles: true, composed: true });
      event.target.dispatchEvent(cancelEvent);
    }
  
    
  
  }
  customElements.define('evax-modal', Modal);

