# General Code Requirements

The application must run locally using Node.js for testing. The code should use Typescript.

The application must be able to run on a static HTML pages via Github Pages with no supporting configuration beyond the initial setup.
When running as a static HTML page, the application must support the use of browser storage to save information.
The application must optionally be able to run from a server that saves information. This must run on a LAN and reject traffic that is not on the local subnet. Otherwise, client data should be trusted.
When the server is running a warning should be displayed in the terminal that this is not secure and should not be deployed to any sort of public network or commercial environment.

The application must require no assets beyond a single HTML file, a single CSS file, minimal image icons, and compiled Typescript or Javascript files.

# General Application Requirements

The application must be able to accept a number of shelves for its storage base. At its home screen, it should display a visual representation of these shelves as a vertical stack (the freezer).
Each shelve should be clickable, which will then display a list of the shelf's contents, sorted by date they were stored. Small circles or other aesthetically-pleasing elements should serve as a visual indicator of how many items are on the shelf to help the user know at a glance if their actual freezer and freezer inventory are up to date.

The home screen should have a "Find" button and a "Store" button.

The "Find" button should bring up a text input that allows the user to find items by keywords in their name. When an item is selected, the user should be able to optionally "Remove" the item, which removes it from the shelf and freezer. There should also be a "Move" button when an item is selected to move it to a different shelf.

The "Store" button should allow the user to input an item into the freezer, entering a name and shelf as a mandatory input. Include optional inputs such as weight, volume, brand, any any other categories that make logical sense for food storage and searching. Each item stored should generate a unique ID which should also produce a QR code that the user can print.

The QR code should link back to the application along with an input parameter that takes it to the "Remove" action for that item. I.e. the user can scan the label of an item in their freezer as they physically remove it and have it remove from the freezer inventory.

Users should be able to select recently-removed items and re-store them.

The application user interface should be sized for a mobile phone. If loaded on a desktop or laptop, it should center in the browser window on a phone-sized interface. The freezer and shelves should display with crisp lines, easy to read fonts and icons, and visually pleasing colors.


# Server Requirements

The Typescript should compile by default to use browser storage on a static HTML page. If a config file is present, it should compile to work with a server.
Include a bash script to install Node.js and all required support files on a Debian server.
