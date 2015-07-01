# The Mailgun Mailer App

The Mailgun mailer app provides a Foxx script and `Foxx.queues` job type for sending transactional emails with [Mailgun](https://mailgun.com/).

**Note:** Version 2.0.0 and higher require ArangoDB 2.6 or later to work correctly.

*Examples*

First add this app to your dependencies:

```js
{
  ...
  "dependencies": {
    "mailer": "mailer-mailgun:^2.0.0"
  }
  ...
}
```

Once you've configured both apps correctly, you can use it like this:

```js
var Foxx = require('org/arangodb/foxx');
var queue = Foxx.queues.get('default');

queue.push(applicationContext.dependencies.mailer, {
    from: 'postmaster@initech.example',
    to: 'john.doe@employees.initech.example',
    subject: 'Termination',
    html: '<blink>YOU ARE FIRED!</blink>',
    'o:tag': ['internal', 'terminations']
});
```

## Configuration

This app has the following configuration options:

* *apiKey*: Your Mailgun API key.
* *domain*: The Mailgun subdomain or custom domain you want the app to use.
* *maxFailures* (optional): The maximum number of times each job will be retried if it fails. Default: *0* (don't retry).

## Job Data

For full documentation of all job data options supported by Mailgun see [the official Mailgun API documentation](http://documentation.mailgun.com/api-sending.html#sending).

You can specify an option multiple times by passing an array as the option's value.

### Attachments

If you want to send attachments, you need to pass them as objects with the following properties:

* *content*: the attachment's base64-encoded content.
* *name*: the name of the attachment that will be used in the e-mail.
* *type* (optional): the attachment's MIME type. Default: *application/octet-stream*

*Examples*

```js
queue.push(applicationContext.dependencies.mailer, {
    // ...
    attachment: {
        content: 'SGVsbG8gV29ybGQh',
        name: 'hello_world.txt',
        type: 'text/plain'
    }
});
```

## License

This code is distributed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0) by ArangoDB GmbH.
