# 🚀 Welcome to Art comparison webpage.

### This project has been created using React.

For installing packages for the first time follow the below commands

```
git clone https://github.com/dass1921/artcomp.git
npm install
```

Once installed to run the project in local

```
npm start
```

To deploy changes, Run the following commands

```
npm run build
npm run deploy
```

### Checklists before deploying.

- [ ] The App runs in local (npm run start).
- [ ] No issues in logging and logging out.
- [ ] Only admin user access to delete art items.
- [ ] Others user roles should not be able to see delete icons.
- [ ] Click on the art item, must redirect user to its similar items.
- [ ] Webpage must be responsive in mobile view, ipads etc (Look in developer console).

### The project structure is as follows.

1. Index.js - Entry point of the web application.
2. App.js - Page structure and Initiates Mongo Connection.
3. Mongo-context.js - Stores the mongo connection details and the global connection variable.
4. User-context.js - Handles user login and sign up with help of login-form.
5. Art-works - Calls Art works API , populates row of card with help of art-item.
6. Art-item - Its the collection of the art-item and its similar art-items.
7. Image-meta - Handles display of image and meta data of the art-work.
8. Filter-panel - Houses filter feature - Controls filter selection and the global variable for filter
9. Filter-pill - The filter pill shows the id of the current image selected and deliberately doesn't show other filter variables.
