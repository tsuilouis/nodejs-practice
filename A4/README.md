## Information
For local testing, you need to go to the bin folder and generate a private key and certificate:

```
openssl genrsa 1024 > private.key
openssl req -new -key private.key -out cert.csr
openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
```

To enable Facebook OAuth, modify [config.js](./config.js) to use your
Facebook App ID and secret.

The [db.json](../db.json) file in the parent directory contains sample data.
