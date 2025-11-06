# On The News (OTN)

A desktop application built with Electron, Angular, and Express.js. This application provides a fullscreen, always-on-top interface for displaying news content.

## 🚀 Features

- **Desktop Application**: Cross-platform Electron-based desktop app
- **Modern UI**: Built with Angular 17 for a responsive and modern user interface
- **Local Web Server**: Integrated Express.js server running on port 27078
- **Code Protection**: JavaScript obfuscation for Electron source code
- **Fullscreen Mode**: Always-on-top, fullscreen window experience
- **Auto-restart**: Automatic server monitoring with heartbeat checks and retry logic

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Angular CLI** (v17.3.17 or compatible)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd otn
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```



## 🏃 Development

### Running the Development Server

To run the application in devlopment server 

```bash
    ng serve 
```

### Check on electron devlopment 
```bash 
    yarn preview
```
### Preview Production Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

This will:
1. Build the Angular application
2. Obfuscate the Electron source code
3. Copy necessary files to the dist directory
4. Start the Electron application

## 📦 Packaging

To package the application for distribution:

```bash
npm run package
# or
yarn package
```

This will:
1. Build the Angular application
2. Obfuscate the Electron source code
3. Copy necessary files
4. Package the application using electron-builder

The packaged application will be created in the `dist/` directory.

## 🔧 Build Process

The build process includes several steps:

1. **Obfuscation**: Electron source code is obfuscated using `javascript-obfuscator` with the configuration from `obfuscator-config.json`
2. **File Copying**: Electron-specific files (index.html, assets) are copied to the dist directory
3. **Angular Build**: The Angular application is built and optimized
4. **Packaging**: The final application is packaged using electron-builder

### Build Scripts

- `npm run build` - Build Angular application
- `npm run obfuscate` - Obfuscate Electron source code
- `npm run cp` - Copy Electron files to dist
- `npm run package` - Full build and package process
- `npm run preview` - Build and preview locally

## 🏗️ Project Structure

```
otn/
├── electron/              # Electron application files
│   ├── assets/           # Icons, builder config, package.json
│   ├── src/              # Electron source code
│   │   ├── main.js       # Main Electron process
│   │   ├── preload.js    # Preload script
│   │   ├── server.js     # Express.js server
│   │   └── utils/        # Utility modules
│   └── index.html        # Electron HTML template
├── src/                  # Angular application source
│   ├── app/              # Angular components and modules
│   ├── assets/           # Static assets
│   └── main.ts           # Angular entry point
├── dist/                 # Build output directory
├── angular.json          # Angular configuration
├── package.json          # Root package.json
├── obfuscator-config.json # Code obfuscation configuration
└── tsconfig.json         # TypeScript configuration
```

## ⚙️ Configuration

### Obfuscation Configuration

The code obfuscation settings are defined in `obfuscator-config.json`. The current configuration includes:
- Control flow flattening
- String array encoding (base64)
- Dead code injection
- Debug protection
- Console output disabling

### Electron Configuration

Electron-specific settings are in `electron/assets/builder.config.json` and `electron/assets/package.json`.

### Angular Configuration

Angular build settings are configured in `angular.json`.

## 🧪 Testing

### Unit Tests

Run unit tests via Karma:

```bash
npm test
# or
yarn test
```

### End-to-End Tests

To run end-to-end tests, you need to first add a package that implements end-to-end testing capabilities:

```bash
npm run e2e
# or
yarn e2e
```

## 📝 Code Scaffolding

Generate new components, services, and more using Angular CLI:

```bash
ng generate component component-name
ng generate service service-name
ng generate directive|pipe|class|guard|interface|enum|module
```

## 🔍 Development Tools

- **Angular CLI**: `ng help` or visit [Angular CLI Overview](https://angular.io/cli)
- **Electron**: [Electron Documentation](https://www.electronjs.org/docs)
- **Express.js**: [Express Documentation](https://expressjs.com/)

## 📄 License

ISC

## 👤 Author

**opezee**
- Email: sudip.das@opezee.com

## 🐛 Troubleshooting

### Port Already in Use

If port 27078 is already in use, you may need to:
1. Close other applications using the port
2. Modify the port in `electron/src/main.js` and `electron/src/server.js`

### Build Errors

If you encounter build errors:
1. Ensure all dependencies are installed
2. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear Angular cache: `ng cache clean`

### Electron Not Starting

If Electron fails to start:
1. Check that all Electron dependencies are installed in the `electron/` directory
2. Verify that the Express server is starting correctly
3. Check the logs for error messages

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [JavaScript Obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)
