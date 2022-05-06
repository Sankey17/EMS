import { generateControllers } from "../../modules/query";
import { Student } from "../student/student.model";

const postStudent = async (req, res) => {
  const data = req.body;
  try {
    Student.find({
      email: {
        $regex: data.email,
        $options: "i"
      }
    }, async(err, myData) => {
      if (myData.length > 0) {
        res.status(422).send({error: "email is already exists"})
        console.log("data2", myData)
      }else {
        await Student.create({...data})
        res.status(200).send("success");
      }
    })
  } catch(err) {
    res.status(422).send({error: "Error in getting student details"});
  }
}

const getStudent = async (req, res) => {
  const { page, limit} = req.query
  const pageLimit = parseInt(limit) || 5
  const skip = parseInt(page)*pageLimit || 0

  const student = await Student.find({}).sort({createdAt: -1}).skip(skip).limit(pageLimit)
  const totalStudent= await Student.find({}).sort({createdAt: -1}).countDocuments()

  res.status(200).send({ student: student || [], page: parseInt(page || 0), limit: pageLimit, totalStudent, pages: Math.ceil(totalStudent/pageLimit) });
}

const deleteStudent = async (req, res) => {
  try {
    await Student.deleteOne({_id: req.params.student_id})
    res.status(200).send("success");
  } catch(err) {
    res.status(422).send({error: "Error in getting student details"});
  }
}

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.student_id );
    res.status(200).send({student: student});
  } catch (err) {
    res.status(422).send({ error: "Error in delete student details" });
  }
}

const updateStudent = async (req, res) => {
  try {
    await Student.findOneAndUpdate({
      _id : req.params.student_id }, req.body)
    res.status(200).send("success");
  } catch (err) {
    res.status(422).send({ error: "Error in delete student details" });
  }
}

export default generateControllers(Student, {
  postStudent, getStudent, deleteStudent, getStudentById, updateStudent
});
