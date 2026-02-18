class System {
  constructor(SystemModel, io) {
    this.SystemModel = SystemModel;
    this.io = io; // socket.io
  }

  addArr(req, res) {
    try {
      const { badge } = req.body;
      this.SystemModel.addArr(badge);

      // Récupérer l'historique après l'action
      const histo = this.SystemModel.addHisto();

      // --- EMIT à tous les sockets ---
      this.io.emit("update_historique", histo);

      res.json({ success: true, message: "Arrivée enregistrée", histo });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  addDep(req, res) {
    try {
      const { badge } = req.body;
      this.SystemModel.addDep(badge);

      const histo = this.SystemModel.addHisto();
      this.io.emit("update_historique", histo);

      res.json({ success: true, message: "Départ enregistré", histo });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  addArrIntrus(req, res) {
    this.SystemModel.addArrIntrus();

    const histo = this.SystemModel.addHisto();
    this.io.emit("update_historique", histo);

    res.json({ success: true, message: "Arrivée intrus enregistrée", histo });
  }

  addDepIntrus(req, res) {
    this.SystemModel.addDepIntrus();

    const histo = this.SystemModel.addHisto();
    this.io.emit("update_historique", histo);

    res.json({ success: true, message: "Départ intrus enregistré", histo });
  }

  getHistorique(req, res) {
    const histo = this.SystemModel.addHisto();
    res.json(histo);
  }
  addUser(req,res)
  {
    try {
      const {nom, badge} = req.body;
      const users = this.SystemModel.addUser(nom, badge);
      res.json(users);
      return;
    } catch (e) {
      console.log(e);
      res.json();
      return;
    }
  }
}

module.exports = { System };
