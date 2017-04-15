# side-navigation
A light-weight side navigation implementation in ES6

## Usage
```
import sideNavigation from 'sideNavigation';

new sideNavigation({ options });
```

### Options

`navigation`: querySelector for the main navigation container

`toggleButton`: querySelector for the main navigation container

`position`: (optional :: string) is either 'left' or 'right' and describes from where the navigation slides in, default: 'left'

`closed`: (optional :: boolean) describes if the navigation is open or closed during initialisation

#### Example
```
new sideNavigation({
    navigation: 'nav#menu',
    toggleButton: '#toggle',
    position: 'right',
    closed: true
})
```

### Styling

Styling is absolutely up to you and your creative freedom.
However, `side-navigation` merely adds a single class to your sidenav when you close it which requires the following:
```
#menu.navigation-closed{
	transform: translateX(-102%);
}
```

Therefore your normal style should contain something along the lines:
```
#menu {
	transform: translateX(0);
}
```

### Contributing

Ideas and discussion is highly appreciated.
Simply open up an issue or PR.
