# The Mailgun Mailer App

The Mailgun mailer app provides a `Foxx.queues` job type for sending transactional emails with [Mailgun](https://mailgun.com/).

*Examples*

```js
var Foxx = require('org/arangodb/foxx')
    queue = Foxx.queues.create('my-queue', 1);

queue.push('mailer.mailgun', {
    from: 'postmaster@initech.example',
    to: 'john.doe@employees.initech.example',
    subject: 'Termination',
    html: '<blink>YOU ARE FIRED!</blink>',
    'o:tag': ['internal', 'terminations']
});

// or if you prefer not to hardcode the job type:

queue.push(Foxx.requireApp('/mailgun-mailer-mountpoint').mailer.jobType, {
    // ...
});
```

## Configuration

This app has the following configuration options:

* *apiKey*: Your Mailgun API key.
* *domain*: The Mailgun subdomain or custom domain you want the app to use.
* *jobType* (optional): The name under which the mailer app's job type will be available. Default: *mailer.mailgun*.
* *maxFailures* (optional): The maximum number of times each job will be retried if it fails. Default: *0* (don't retry).

## Job Data

For full documentation of all job data options supported by Mailgun see [the official Mailgun API documentation](http://documentation.mailgun.com/api-sending.html#sending).

You can specify an option multiple times by passing an array as the option's value.

### Attachments

If you want to send attachments, you need to pass them as objects with the following properties:

* *content*: the attachment's base64-encoded content.
* *filename*: the filename of the attachment that will be used in the e-mail.
* *contentType* (optional): the attachment's MIME type. Default: *application/octet-stream*

*Examples*

```js
queue.push('mailer.mailgun', {
    // ...
    attachment: {
        content: 'SGVsbG8gV29ybGQh',
        filename: 'hello_world.txt',
        contentType: 'text/plain'
    }
});
```