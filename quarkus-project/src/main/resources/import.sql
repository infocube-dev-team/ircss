-- This file allow to write SQL commands that will be emitted in test and dev.

-- The commands are commented as their support depends of the database
insert into store (id, code, description) values(nextval('hibernate_sequence'), 'TEST', 'Store di test');
insert into store (id, code, description) values(nextval('hibernate_sequence'), 'PROVA', 'prova');
insert into store (id, code, description) values(nextval('hibernate_sequence'), 'NA', 'Store napoli');

insert into person (id, name, surname, fiscalCode, email, cellularNumber, sexCode) values(nextval('hibernate_sequence'), 'Mario', 'Rossi', 'RSSMRA98H19F839S', 'mario.rossi@gmail.com', '3345577098', 'M');
insert into person (id, name, surname, fiscalCode, email, cellularNumber, sexCode) values(nextval('hibernate_sequence'), 'Roberto', 'Rossi', 'RSSRRT98H19F205R', 'rob.rossi@gmail.com', '3348679028', 'M');