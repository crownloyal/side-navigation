class sideNavigation {

    constructor(navSelector, buttonSelector) {
        this.navigationContainer = document.querySelector(navSelector);
        this.navigationToggleButton = document.querySelector(buttonSelector);

        this._setup();
        this._functionBindings();
        this._bindings();

        this.hideNavigation();
    }
    _setup() {
        this.state = {
            isClosed : true,
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
        this.navigationContainer.addEventListener('touchstart', this._initiateTouch);
        this.navigationContainer.addEventListener('touchmove', this._trackTouch);
        this.navigationContainer.addEventListener('touchend', this._endTouch);
        this.navigationToggleButton.addEventListener('click', this.toggleNavigation)
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

        if(!this.state.touchingNavigation || this.touch.dragDirection() === 'left') return;

        this.navigationContainer.style.transform = 'translateX(' + this.touch.distanceX() + 'px)';
        this.navigationContainer.style.opacity = 1 - this.touch.distanceX()*0.005;
    }
    _endTouch(event) {
        if(!this.state.touchingNavigation) { return; }

        if(this.touch.dragDirection() === 'right' && this.touch.swipeLimit < this.touch.distanceX()) {
            this.hideNavigation();
        } else {
            this.openNavigation();
        }
        // reset touch timer & touch state
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
        this.propagateState();
        this.resetStyle();
    }
    openNavigation () {
        this.state.isClosed = false;
        this.propagateState();
        this.resetStyle();
    }
    resetStyle() {
        this.navigationContainer.style.transform = "";
        this.navigationContainer.style.opacity = "";
    }
    propagateState() {
        if(this.state.isClosed) {
            this.navigationContainer.classList.add('navigation-closed');
        } else {
            this.navigationContainer.classList.remove('navigation-closed');
        }
    }
}

let sidenav = new sideNavigation('aside', '#toggle-side-menu');