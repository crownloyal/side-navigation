'use strict';

class sideNavigation {
    constructor(options) {

        if(! options.navigation || options.toggleButton) {
            new Error("Please define navigation and toggle button in an options object.")
        }
        options.position = (options.position === 'right') ? options.position : 'left';
        options.closed = (options.closed === false ) ? options.closed : true;

        this.settings = {
            navigationContainer : document.querySelector(options.navigation),
            toggleButton : document.querySelector(options.toggleButton),
            closed: options.closed,
            position : options.position
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
            startTimestamp : 0,
            lastPositionX : 0,
            lastDirection : null,
            reversed : false,
            swipeWidthRatio : 0.3,
            fastSwipeDistance : 40,
            fastSwipeDuration : 200,
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
        this.touch.animatePositionX = this.touch.startPositionX;
        this.touch.lastPositionX = this.touch.startPositionX;
        this.touch.lastDirection = null;
        this.touch.reversed = false;
        this.touch.startTimestamp = this._touchTimestamp(event);
    }
    _trackTouch(event) {
        if(!this.state.touchingNavigation) return;

        this.touch.animatePositionX = event.touches[0].pageX;
        if(this.touch.animatePositionX !== this.touch.lastPositionX) {
            let currentDirection = (this.touch.animatePositionX < this.touch.lastPositionX) ? 'left' : 'right';
            if(this.touch.lastDirection && this.touch.lastDirection !== currentDirection) {
                this.touch.reversed = true;
            }
            this.touch.lastDirection = currentDirection;
            this.touch.lastPositionX = this.touch.animatePositionX;
        }

        if(this.touch.dragDirection() !== this.settings.position) return;

        this.settings.navigationContainer.style.transform = 'translateX(' + this.touch.distanceX() + 'px)';
        this.settings.navigationContainer.style.opacity = 1 - Math.abs(this.touch.distanceX()) * 0.005;
    }
    _endTouch(event) {
        if(!this.state.touchingNavigation) { return; }

        if(this._isClosingSwipe(event)) {
            this.hideNavigation();
        } else {
            this.openNavigation();
        }

        this.state.touchingNavigation = false;
        this.touch.timer = 0;
        this.touch.reversed = false;
    }
    _touchTimestamp(event) {
        if(typeof event.timeStamp === 'number') {
            return event.timeStamp;
        }
        return Date.now();
    }
    _navigationWidth() {
        if(this.settings.navigationContainer.getBoundingClientRect) {
            return this.settings.navigationContainer.getBoundingClientRect().width;
        }
        return this.settings.navigationContainer.offsetWidth || 0;
    }
    _isClosingSwipe(event) {
        let dragDistance = Math.abs(this.touch.distanceX());
        let swipeLimit = this._navigationWidth() * this.touch.swipeWidthRatio;
        let minimumFastSwipeDistance = Math.min(this.touch.fastSwipeDistance, swipeLimit || this.touch.fastSwipeDistance);
        let isFastSwipe = this._touchTimestamp(event) - this.touch.startTimestamp <= this.touch.fastSwipeDuration;

        return this.touch.dragDirection() === this.settings.position &&
            !this.touch.reversed &&
            (dragDistance >= swipeLimit || (isFastSwipe && dragDistance >= minimumFastSwipeDistance));
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