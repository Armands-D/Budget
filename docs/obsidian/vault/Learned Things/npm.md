# Best Practice
Don't install packages globally, unless its is a npm utility such as `n` or `npm-check-updates`.

>Updating a global package would make all your projects use the new release, and as you can imagine this might cause nightmares in terms of maintenance, as some packages might break compatibility with further dependencies, and so on.
>All projects have their own local version of a package, even if this might appear like a waste of resources, it’s minimal compared to the possible negative consequences.
 > [Source](https://www.rockyourcode.com/run-locally-installed-npm-packages-without-global-install/)
# Outdated Packages
List outdated packages for a project, current state, wanted version and latest version.
```sh
npm outdated
```

Output:
```css
Package                      Current   Wanted   Latest  Location  Depended by  
@testing-library/jest-dom    MISSING    6.4.2    6.4.2  -         app  
@testing-library/react       MISSING   14.3.0   14.3.0  -         app  
@testing-library/user-event  MISSING   14.5.2   14.5.2  -         app  
@types/jest                  MISSING  29.5.12  29.5.12  -         app  
@types/node                  MISSING  20.12.5  20.12.5  -         app  
@types/react                 MISSING  18.2.74  18.2.74  -         app  
@types/react-dom             MISSING  18.2.24  18.2.24  -         app  
react                        MISSING   18.2.0   18.2.0  -         app  
react-dom                    MISSING   18.2.0   18.2.0  -         app  
react-scripts                MISSING    5.0.1    5.0.1  -         app  
typescript                   MISSING    5.4.4    5.4.4  -         app  
web-vitals                   MISSING    3.5.2    3.5.2  -         app
```

## node-check-updates
Check latest versions for all packages.
```sh
ncu
```

Update `package.json` packages to latest version
```sh
ncu -u
```

Then `npm i` to install packages to updated `package.json`

# List Packages
Locally
```sh
npm ls
```
Globally
```sh
npm ls -g
```

# Node Versions
Manage Node versions using `n`.
```sh
npm i n
```

> [Documentation](https://www.npmjs.com/package/n)