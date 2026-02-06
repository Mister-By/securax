CREATE TABLE personnes (
  idper INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT ,
  badge TEXT UNIQUE 
);
CREATE TABLE actions (
  idact INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL
);
CREATE TABLE actionpersonne (
  idper INTEGER NOT NULL,
  idact INTEGER NOT NULL,
  heure DATETIME DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (idper, idact, heure),

  FOREIGN KEY (idper) REFERENCES personnes(idper),
  FOREIGN KEY (idact) REFERENCES actions(idact)
);

INSERT INTO personnes(nom, badge) values ("Instrus", null);

INSERT INTO actions(type) values ("Arrive"),("Depart"), ("Instrusion1"), ("Instrusion2");


