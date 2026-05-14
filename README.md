# Taco Bell Drop Buddy

## Author

Isaac Hog Whitfield
*Developer and Creator* 
Created: May 14, 2026

## Project Description

The Taco Bell Drop Buddy is a specialized web-based application designed to help Taco Bell restaurant employees efficiently manage product hold timers and track inventory during peak operational periods. This tool prevents food waste, improves staff coordination, and ensures compliance with food safety hold time regulations by providing real-time notifications and comprehensive tracking of held products.

---

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Requirements](#requirements)
3. [Installation Instructions](#installation-instructions)
4. [Usage Instructions](#usage-instructions)
5. [Documentation](#documentation)
6. [Visuals](#visuals)
7. [Support Information](#support-information)
8. [Project Roadmap](#project-roadmap)
9. [Project Status](#project-status)
10. [Contribution Guidelines](#contribution-guidelines)
11. [Acknowledgments](#acknowledgments)
12. [License Information](#license-information)
13. [Conclusion](#conclusion)

---

## Technologies Used

- **Frontend Framework**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS3 with Flexbox and Grid layouts
- **Audio**: Web Audio API for notification sounds
- **Storage**: Browser localStorage (optional for future enhancement)
- **Server**: Python HTTP Server or any static file server
- **Version Control**: Git

---

## Requirements

### System Requirements

- Operating System: Windows, macOS, or Linux
- RAM: 512MB minimum
- Storage: 5MB for installation

### Browser Requirements

- **Chrome 60+**
- **Firefox 55+**
- **Safari 11+**
- **Microsoft Edge 79+**
- JavaScript enabled in browser
- Audio support for notifications

---

## Installation Instructions

### Option 1: Using Python (Recommended)

1. Download or clone the project to your local machine
2. Navigate to the project directory in your terminal/command prompt:
   ```bash
   cd /path/to/taco-bell-drop-buddy
   ```
3. Start the Python web server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and visit:
   ```
   http://localhost:8000
   ```

### Option 2: Using Node.js

1. Download or clone the project
2. Navigate to the project directory:
   ```bash
   cd /path/to/taco-bell-drop-buddy
   ```
3. Install a simple server (if not already installed):
   ```bash
   npm install -g serve
   ```
4. Start the server:
   ```bash
   serve .
   ```
5. Access the app through the provided URL

### Option 3: Using Any Web Server

1. Place all files in your web server's document root
2. Access the application through your server's URL
3. Example for Apache: `http://yourdomain.com/taco-bell-drop-buddy/`

### Option 4: Direct File Access

1. Download all files to your local machine
2. Double-click `index.html` to open in your default browser
3. Note: Some features may be limited without a proper web server

---

## Usage Instructions

### Getting Started

1. **Launch the App**: Open the application in your web browser
2. **Welcome Screen**: Click the "Start" button to begin

### Adding Products

1. Select a product from the available items
2. Choose "Add product" action
3. Enter the quantity being added
4. Confirm - the hold timer will automatically start
5. You'll see a confirmation message on the selection page

### Removing Products

1. Select a product from the available items
2. Choose "Remove product" action
3. Enter the quantity to remove
4. Confirm - removed products are deducted from held inventory
5. You'll return to the product selection page

### Monitoring Held Products

1. Click "Currently Holding" button from the selection page
2. View all products with their remaining hold times
3. Monitor the hold timer displayed at the top
4. Review discarded products in the separate section

### Hold Timers

- **Standard Items**: 4-hour hold timer (Stake, Beef, Chicken, Cantina Chicken, Rice, Refried Beans)
- **Nacho Cheese Sauce**: 8-hour hold timer
- Timers start automatically when products are added
- Audio and visual alerts occur when timers expire

### Notifications

- **Low Stock Alert**: Triggers when any product quantity drops below 2 units
- **Discard Alert**: Audio notification plays when hold timer reaches zero
- Both alerts appear as colored banners on the screen

### Generating Reports

1. Go to "Currently Holding" page
2. Click "Print report" button
3. Review the report showing all held and discarded items
4. Print to PDF or physical printer as needed

### Starting a New Shift

1. Go to "Currently Holding" page
2. Click "Start new shift" button
3. Confirm the action
4. All held and discarded data will be cleared
5. App resets to product selection page

---

## Documentation

### File Structure

```
taco-bell-drop-buddy/
├── index.html          # Main HTML structure
├── styles.css          # Application styling
├── script.js           # JavaScript logic and functionality
├── README.md           # Project documentation
└── Taco Bell Wallpaper By Wmill.png  # Background image
```

### Key Functions

- `addHoldItem()`: Adds products to hold list with timer
- `removeHoldItem()`: Removes specified quantity from held products
- `checkLowStockNotifications()`: Monitors inventory levels
- `playDiscardSound()`: Generates audio alert for discards
- `renderHoldingList()`: Updates UI with current held products
- `buildPrintReport()`: Generates printable inventory report

### Data Structure

Products are stored in memory with the following properties:
- `item`: Product name
- `quantity`: Number of units
- `startedAt`: Timestamp when hold started
- `expiresAt`: Timestamp when hold expires

---

## Visuals

### Application Interface

- **Start Page**: Welcome screen with prominent Start button
- **Product Selection**: Grid layout of available menu items
- **Action Page**: Radio buttons to add or remove products with quantity input
- **Holding Page**: List view of current held products with timers
- **Transparent Design**: Background image visible through all containers
- **Responsive Layout**: Adapts to different screen sizes

### Color Scheme

- Primary Action: Amber (#f59e0b)
- Alert Banner: Pink (#f9a8d4)
- Low Stock Alert: Red (#fecaca)
- Text: Light gray/white (#f8fafc)
- Background: Dark semi-transparent overlays

---

## Support Information

### Troubleshooting

**Q: Audio notifications aren't playing**
- A: Check browser audio settings and ensure volume is not muted
- A: Some browsers require user interaction before audio can play
- A: Try clicking the Start button first to enable audio context

**Q: Hold timer isn't counting down**
- A: Ensure JavaScript is enabled in your browser
- A: Try refreshing the page
- A: Check browser console for errors (F12 → Console tab)

**Q: Products are disappearing**
- A: This occurs when the hold timer reaches zero (intended behavior)
- A: Check the "Discarded items" section for removed products
- A: Start a new shift to clear old data

**Q: Report won't print**
- A: Use Ctrl+P (Windows) or Cmd+P (Mac) when viewing the report
- A: Ensure pop-ups are not blocked in your browser
- A: Try printing to PDF instead of physical printer

### Contact Support

For additional support or bug reports, please contact the development team.

---

## Project Roadmap

### Completed Features
✓ Product hold timer management
✓ Low stock notifications
✓ Discard alerts with audio
✓ Report generation and printing
✓ Shift management
✓ Responsive design
✓ Audio notifications

### Planned Features
- [ ] Local storage for data persistence
- [ ] Multiple restaurant location support
- [ ] Advanced analytics and reporting
- [ ] Mobile app version
- [ ] Real-time team notifications
- [ ] Integration with POS systems
- [ ] Custom product configuration
- [ ] Email alert support
- [ ] Data export to CSV/Excel
- [ ] Admin dashboard for managers

---

## Project Status

**Current Version**: 1.0.0  
**Status**: Active Development & Production Ready  
**Last Updated**: May 14, 2026

### Recent Updates
- Enhanced transparency for better UI aesthetics
- Improved notification system with sound alerts
- Better product removal workflow
- Comprehensive documentation

---

## Contribution Guidelines

### How to Contribute

1. **Report Bugs**: Submit detailed bug reports with steps to reproduce
2. **Suggest Features**: Propose new features with use cases
3. **Improve Documentation**: Help enhance existing documentation
4. **Code Contributions**: Submit pull requests for bug fixes or features

### Contribution Standards

- Maintain code quality and readability
- Test changes thoroughly before submitting
- Follow existing code style and conventions
- Include comments for complex logic
- Update documentation as needed

### Submission Process

1. Create a fork of the project
2. Create a feature branch for your changes
3. Commit changes with descriptive messages
4. Submit a pull request with detailed description
5. Respond to code review feedback

---

## Acknowledgments

- **Isaac Hog Whitfield**: Lead Developer and Creator
- **Taco Bell**: Inspiration and operational requirements
- **Web Audio API**: Sound notification technology
- **Open Source Community**: Supporting libraries and resources
- **Contributors**: All individuals who have provided feedback and improvements

---

## License Information

**License Type**: Proprietary  
**Copyright**: © 2026 PC User

### Usage Rights

This software is provided for operational use at Taco Bell locations. Redistribution, modification, or commercial use without explicit permission is prohibited.

### Disclaimer

This software is provided "AS IS" without warranty of any kind. Users assume all responsibility for proper operation and data management. The developers are not liable for any damages or data loss resulting from use of this application.

---

## Conclusion

The Taco Bell Drop Buddy represents a practical solution to a real operational challenge in fast-food restaurants. By automating hold timer management and providing intelligent notifications, this application helps staff focus on customer service while maintaining food safety standards.

With its intuitive interface and comprehensive feature set, the Taco Bell Drop Buddy is designed to integrate seamlessly into daily operations. Continued development and user feedback will help make this tool even more valuable to restaurant teams.

Thank you for using the Taco Bell Drop Buddy. We hope it enhances your operational efficiency and contributes to a better customer experience.

---

**For questions or feedback, please reach out to the development team.**

*Last Updated: May 14, 2026*
