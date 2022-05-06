import { generateControllers } from "../../modules/query";
import { Teammanagment } from "./teammanagement.model";

const getTeam = async (req, res) => {
  console.log(req.body);
  try {
    const team = await Teammanagment.find();
    res.json(team);
  } catch (err) {
    res.send("error", err);
  }
};

const postTeam = async (req, res) => {
  try {
    const team = new Teammanagment({
      teamleadname: req.body.teamleadname,
      department: req.body.department,
      employee: req.body.employee,
      totalemployee: req.body.totalemployee,
    });

    const al = await team.save();
    res.json(al);
  } catch (err) {
    res.send("error", err);
  }
};

const updateTeam = async (req, res) => {
  try {
    await Teammanagment.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).send(req.body);
  } catch (err) {
    res.status(422).send("error", err);
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Teammanagment.findByIdAndRemove(req.params.id);
    res.json(team);
  } catch (err) {
    res.send("error", err);
  }
};

export default generateControllers(Teammanagment, {
  getTeam,
  postTeam,
  updateTeam,
  deleteTeam,
});
