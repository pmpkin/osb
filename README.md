# node-osb-cli
A simple cli tool to upload files to [SoftLayer object storage](http://www.softlayer.com/object-storage).

## Installation
Install the npm package globally
```
npm install node-osb-cli -g
```

## Usage
Invoke osb from a command line:
```
osb [command] [options]
```

## Commands and options
Type ``` osb ``` or ``` osb help ``` to get a list of available commands and options
```
$ osb -h

  Usage: osb [options] [command]


  Commands:

    upload [path]  Upload a file or contents of a directory to object storage
    help [cmd]     display help for [cmd]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -c, --container [container]  The target container (required)
    -n, --network [network]      Use public or private network for upload. Values: private, public (defaults to public)
    -p, --password [password]    Your password (API key, required)
    -r, --region [region]        The region, for example fra02 (required)
    -t, --ttl [ttl]              The time to live of the uploaded file (in seconds, optional)
    -u, --user [user]            Your username (required)

```

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
