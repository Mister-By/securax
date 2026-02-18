class SystemModel {
  constructor(db) {
    this.db = db;
  }

  // =========================
  // ARRIVEE PERSONNE
  // =========================
  addArr(badge) {
    const person = this.db
      .prepare("SELECT idper FROM personnes WHERE badge = ?")
      .get(badge);

    if (!person) {
      throw new Error("Badge inconnu");
    }

    const action = this.db
      .prepare("SELECT idact FROM actions WHERE type = 'Arrive'")
      .get();

    this.db.prepare(`
      INSERT INTO actionpersonne (idper, idact)
      VALUES (?, ?)
    `).run(person.idper, action.idact);
  }

  // =========================
  // DEPART PERSONNE
  // =========================
  addDep(badge) {
    const person = this.db
      .prepare("SELECT idper FROM personnes WHERE badge = ?")
      .get(badge);

    if (!person) {
      throw new Error("Badge inconnu");
    }

    const action = this.db
      .prepare("SELECT idact FROM actions WHERE type = 'Depart'")
      .get();

    this.db.prepare(`
      INSERT INTO actionpersonne (idper, idact)
      VALUES (?, ?)
    `).run(person.idper, action.idact);
  }

  // =========================
  // ARRIVEE INTRUS
  // =========================
  addArrIntrus() {
    const action = this.db
      .prepare("SELECT idact FROM actions WHERE type = 'Instrusion1'")
      .get();

    // On utilise le "personne" intrus (badge NULL)
    const intrus = this.db
      .prepare("SELECT idper FROM personnes WHERE badge IS NULL")
      .get();

    this.db.prepare(`
      INSERT INTO actionpersonne (idper, idact)
      VALUES (?, ?)
    `).run(intrus.idper, action.idact);
  }

  // =========================
  // DEPART INTRUS
  // =========================
  addDepIntrus() {
    const action = this.db
      .prepare("SELECT idact FROM actions WHERE type = 'Instrusion2'")
      .get();

    const intrus = this.db
      .prepare("SELECT idper FROM personnes WHERE badge IS NULL")
      .get();

    this.db.prepare(`
      INSERT INTO actionpersonne (idper, idact)
      VALUES (?, ?)
    `).run(intrus.idper, action.idact);
  }

  // =========================
  // HISTORIQUE
  // =========================
  addHisto() {
    return this.db.prepare(`
      SELECT 
        p.nom,
        p.badge,
        a.type,
        ap.heure
      FROM actionpersonne ap
      LEFT JOIN personnes p ON ap.idper = p.idper
      JOIN actions a ON ap.idact = a.idact
      ORDER BY ap.heure DESC
    `).all();
  }
  addUser(n,b)
  {
    this.db.prepare(`
      INSERT INTO Personnes (nom, badge)
      VALUES (?, ?)
    `).run(n, b);
    return this.db
      .prepare("SELECT * FROM personnes")
      .all();
  }

  getAllUser()
  {
    return this.db
      .prepare("SELECT * FROM personnes")
      .all();
  }
  modifUser(i,n,b)
  {
    this.db.prepare(`
      UPDATE personnes set nom = ?, badge = ? where idper is ?
    `).run(n, b, i);
    return this.db
      .prepare("SELECT * FROM personnes")
      .all();
  }

  delUser(i)
  {
    this.db.prepare(`
      delete from personnes where idper is ?
    `).run(i);
    return this.db
      .prepare("SELECT * FROM personnes")
      .all();
  }
}

module.exports = { SystemModel };
