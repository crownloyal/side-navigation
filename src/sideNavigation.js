'use strict';

class sideNavigation {
    constructor(options) {

        if(! options.navigation || options.toggleButton) {
            new Error("Please define navigation and toggle button in an options object.")
        }
        if(! options.position == 'left' || 'right') { options.position = undefined; }
        if(! options.closed == true || false ) { options.position = undefined; }

        this.settings = {
            navigationContainer : document.querySelector(options.navigation),
            toggleButton : document.querySelector(options.toggleButton),
            closed: options.closed || 'true',
            position : options.position || 'left'
        }

        this._setup();
        this._functionBindings();
        this._bindings();

        this._propagateState();
    }
    _setup() {
        this.state = {
            isClosed : this.settings.closed,
            touchingNavigation : false,
            lastInteraction : 0
        }
        this.touch = {
            startPositionX : 0,
            animatePositionX : 0,
            swipeLimit : 75,
            distanceX : () => {
                return this.touch.animatePositionX - this.touch.startPositionX;
            },
            dragDirection : () => {
                if (this.touch.startPositionX > this.touch.animatePositionX) {
                    return "left";
                } else {
                    return "right";
                }
            },

            timer : 0
        }
    }
    _bindings() {
        this.settings.navigationContainer.addEventListener('touchstart', this._initiateTouch);
        this.settings.navigationContainer.addEventListener('touchmove', this._trackTouch);
        this.settings.navigationContainer.addEventListener('touchend', this._endTouch);
        this.settings.toggleButton.addEventListener('click', this.toggleNavigation)
    }
    _functionBindings() {
        this._initiateTouch = this._initiateTouch.bind(this);
        this._trackTouch = this._trackTouch.bind(this);
        this._endTouch = this._endTouch.bind(this);
        this.toggleNavigation = this.toggleNavigation.bind(this);
    }

    _initiateTouch(event) {
        if(this.state.isClosed) return;

        this.state.touchingNavigation = true;
        this.touch.startPositionX = event.touches[0].pageX;
    }
    _trackTouch(event) {
        this.touch.animatePositionX = event.touches[0].pageX;

        if(! this.state.touchingNavigation || this.touch.dragDirection() === this.settings.position) return;

        this.settings.navigationContainer.style.transform = 'translateX(' + this.touch.distanceX() + 'px)';
        this.settings.navigationContainer.style.opacity = 1 - Math.abs(this.touch.distanceX()) * 0.005;
    }
    _endTouch(event) {
        if(!this.state.touchingNavigation) { return; }

        if(this.touch.dragDirection() === this.settings.position && this.touch.swipeLimit < Math.abs(this.touch.distanceX())) {
            this.hideNavigation();
        } else {
            this.openNavigation();
        }

        this.state.touchingNavigation = false;
        this.touch.timer = 0;
    }
    toggleNavigation() {
        if(this.state.isClosed) {
            this.openNavigation();
        } else {
            this.hideNavigation();
        }
    }
    hideNavigation() {
        this.state.isClosed = true;
        this._propagateState();
        this.resetStyle();
    }
    openNavigation () {
        this.state.isClosed = false;
        this._propagateState();
        this.resetStyle();
    }
    resetStyle() {
        this.settings.navigationContainer.style.transform = "";
        this.settings.navigationContainer.style.opacity = "";
    }
    _propagateState() {
        if(this.state.isClosed) {
            this.settings.navigationContainer.classList.add('navigation-closed');
        } else {
            this.settings.navigationContainer.classList.remove('navigation-closed');
        }
    }
}

export default (options) => {
    return new sideNavigation(options);
}