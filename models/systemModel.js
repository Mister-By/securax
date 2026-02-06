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
}

module.exports = { SystemModel };
