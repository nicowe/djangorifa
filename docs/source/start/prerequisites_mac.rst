Installation prerequisites
=================================

To use Djangorifa you first need to install PostgreSQL (Database), Postgis (Geo-database on top of Postgres) and some additional geo packages, which you can get as a bundle called GDAL Complete.
This guide (http://me4bruno.wordpress.com/2012/02/13/installation-von-postgresql-mit-postgis-auf-mac-lion/) can help for the PostgreSQL and Postgis part.

PostgreSQL
==========

Download and install PostgreSQL Version 9.1.5 from http://www.enterprisedb.com/products-services-training/pgdownload#osx.
Try to run psql from the command line and see if it works. Type: select version(); from inside psql to print your version.
I needed to change some library files to make it work, see http://stackoverflow.com/questions/11538249/python-pip-install-psycopg2-install-error.
If you have problems with login because it asks for password authentication, see http://webcache.googleusercontent.com/search?q=cache:ab2erABKRH0J:stackoverflow.com/questions/7695962/postgresql-password-authentication-failed-for-user-postgres+&cd=1&hl=de&ct=clnk

Postgis
=======

Install it using the Application Stack Builder which comes with the PostgreSQL installation. Select Postgis 1.5.0.

GDAL
====

Install the framework GDAL Complete from http://www.kyngchaos.com/software/frameworks.

