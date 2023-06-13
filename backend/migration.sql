DROP TABLE IF EXISTS todo;

CREATE TABLE todo(
  id SERIAL PRIMARY KEY ,
  text TEXT
);

INSERT INTO todo(text) VALUES ('Mow the lawn');
INSERT INTO todo(text) VALUES ('Do the dishes');
INSERT INTO todo(text) VALUES ('Mop the floor');