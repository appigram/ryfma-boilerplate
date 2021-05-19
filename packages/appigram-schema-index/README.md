## orcprogramming:collection2-core-server
Wrapper around [aldeed:collection2-core](https://atmospherejs.com/aldeed/collection2-core) to limit the scope of said package to be server side only. As a results, both Collection2 and
simpl-schema are removed from the client bundle resulting in a saving of 47.1KB.

## Installation
In your Meteor app directory, enter:
```
$ meteor add orcprogramming:collection2-core-server
$ meteor npm install --save simpl-schema
```
