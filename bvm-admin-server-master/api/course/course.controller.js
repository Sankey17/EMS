import { Course } from "../course/course.model";
import { generateControllers } from "../../modules/query";

const postCourse = async (req, res) => {
  const data = req.body;
  try {
    Course.find({
      course: {
        $regex: data.course.trim(),
        $options: "i"
      }
    }, async(err, myData) => {
      if(myData.length > 0) {
        res.status(422).send({error: "course is already exists"});
      }else {
        await Course.create({...data})
        res.status(200).send("success");
      }
    })
  } catch(err) {
    res.status(422).send({error: "Error in getting course details"});
  }
}

const getCourse = async (req, res) => {
  const { page, limit} = req.query
  const pageLimit = parseInt(limit) || 5
  const skip = parseInt(page)*pageLimit || 0

  const course = await Course.find({}).sort({createdAt: -1}).skip(skip).limit(pageLimit)
  const totalCourse= await Course.find({}).sort({createdAt: -1}).countDocuments()

  if (page !== '') {
    res.status(200).send({ course: course || [], page: parseInt(page || 0), limit: pageLimit, totalCourse, pages: Math.ceil(totalCourse/pageLimit) });
  }else {
    Course.find({}, (err, myData) => {
      res.status(200).send({course: myData})
    })
  }
}

const deleteCourse = async (req, res) => {
  try {
    await Course.deleteOne({_id: req.params.course_id})
    res.status(200).send("success");
  } catch(err) {
    res.status(422).send({error: "Error in getting course details"});
  }
}

const updateCourse = async (req, res) => {
  try {
    await Course.findOneAndUpdate({
        _id : req.params.course_id }, req.body)
    res.status(200).send("success");
  } catch (err) {
    res.status(422).send({ error: "Error in delete course details" });
  }
}

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.course_id );
    res.status(200).send({course: course});
  } catch (err) {
    res.status(422).send({ error: "Error in delete course details" });
  }
}

export default generateControllers(Course, {
  postCourse, getCourse, deleteCourse, updateCourse, getCourseById
});

