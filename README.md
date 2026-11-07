# K Explore – Event Management Website

A responsive event website where users can explore upcoming events, view details and register.

**Live site:** https://swastika1910.github.io/k-explore/

## Features
- Hero section with a live countdown to the next event
- Event cards with name, date, venue, image and short description
- Search by keyword and filter by category
- Event detail view with registration form
- JavaScript validation: name (letters only), email format, 10-digit Indian mobile number
- Confirmation message after successful registration
- Responsive on mobile, tablet and desktop
- **Bonus:** dark/light mode (remembers your choice), countdown timer, Local Storage registrations with cancel option, duplicate-registration check

## Tech stack
HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript. No build step.

## Project structure
```
index.html   page structure
style.css    layout, theming, responsiveness
script.js    event data, filtering, validation, storage, countdown
```

## Run locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy
Push to GitHub, then enable GitHub Pages (Settings → Pages → main branch) or import the repo in Vercel or Netlify.

## How it works
Event dates are generated relative to today in `script.js`, so countdowns always show upcoming events. Registrations and the theme are saved in `localStorage` under the keys `regs` and `theme`. Replace the `EVENTS` array with your own data to customise.
