# Personal Portfolio Website

A modern, pink-themed personal portfolio built with **HTML, CSS, JavaScript, PHP, and MySQL**.

## Folder structure

```
portfolio/
├── index.html            Main page (all sections)
├── css/
│   └── style.css         All styling (theme, layout, responsiveness, animations)
├── js/
│   └── script.js         Nav, scroll animations, dynamic projects, contact form
├── php/
│   ├── config.php        Database connection settings
│   ├── get_projects.php  Returns projects from MySQL as JSON
│   └── contact.php       Validates and saves contact form submissions
├── sql/
│   └── database.sql      Creates the database, tables, and sample data
└── images/                Put your profile photos here (profile.jpg, about.jpg)
```

## Requirements

- A local server with PHP and MySQL — the easiest way is **XAMPP**, **WAMP**, or **MAMP**.
- Any modern web browser.

## Setup steps

1. **Install a local server** if you don't have one already (e.g. [XAMPP](https://www.apachefriends.org/)).

2. **Copy this `portfolio` folder** into your server's web root:
   - XAMPP: `htdocs/portfolio`
   - WAMP: `www/portfolio`
   - MAMP: `htdocs/portfolio`

3. **Create the database:**
   - Start Apache and MySQL from your XAMPP/WAMP/MAMP control panel.
   - Open `http://localhost/phpmyadmin`.
   - Click **Import**, choose `sql/database.sql`, and run it.
   - This creates a `portfolio_db` database with a `projects` table (with sample
     rows) and an empty `contact_messages` table.

4. **Check your database credentials** in `php/config.php`. The defaults
   (`localhost` / `root` / no password) work for most default XAMPP/MAMP setups.

5. **Open the site** in your browser:
   ```
   http://localhost/portfolio/
   ```

That's it — the "Projects" section will load its cards from MySQL, and the
"Contact" form will save messages into the `contact_messages` table.

> **Note:** If you open `index.html` directly as a file (double-click, no
> server running), the page still works and looks the same, but the Projects
> section will show sample placeholder data instead of the database content,
> and the contact form won't be able to save messages — that's expected,
> since PHP needs a server to run.

## Customizing the content

Everything you'll want to personalize lives in `index.html`:

- **Name, role, and bio** — Home and About sections.
- **Skills** — edit the `<span class="pill">` items inside the Skills section.
- **Education / Experience** — edit or duplicate the `.timeline-item` blocks.
- **Projects** — either edit the rows in `sql/database.sql` and re-import, or
  run `UPDATE`/`INSERT` statements directly in phpMyAdmin.
- **Contact info & social links** — update the email, phone, and `href`
  attributes in the Contact section and hero socials.
- **Photos** — drop `profile.jpg` and `about.jpg` into the `images/` folder.
  If no image is found, a placeholder icon is shown automatically.

## Color palette

The whole theme is controlled from a handful of CSS variables at the top of
`css/style.css`, under `:root`. Change these to restyle the entire site:

```css
--bg:            #FFFBFA;   /* page background */
--bg-soft:       #FCEEF3;   /* alternate section background */
--accent:        #C33E63;   /* primary pink/rose accent */
--accent-light:  #F2A8BE;   /* lighter pink, used in gradients */
--accent-dark:   #8A2846;   /* darker pink, used for hover states */
```

## Notes on the "database" features

- `projects` table → powers the Projects section (`php/get_projects.php`
  reads it, `js/script.js` renders the cards).
- `contact_messages` table → every contact form submission is stored here
  via `php/contact.php`, using a prepared statement to prevent SQL injection.

Feel free to add more tables later (e.g. `skills`, `education`, `experience`)
if you'd like those sections to be database-driven too — the current setup
keeps them as plain HTML to stay simple and beginner-friendly.
