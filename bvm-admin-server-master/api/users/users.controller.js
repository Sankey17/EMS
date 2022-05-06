import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {generateControllers} from "../../modules/query";
import {Users} from "./users.model";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ProfileData = async (req, res) => {
    try {
        await Users.find({"emailId": req.body.emailId}, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.send(result)
        });
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting employee details"});
    }
};

const UpdateProfileData = async (req, res) => {
    try {
        await Users.findByIdAndUpdate(req.params.Users_id, {$set: req.body}, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.send('Done')
        });
    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting employee details"});
    }
};

const CheckBirthday = async (req, res) => {
    try {
        await Users.find({
            "$expr": {
                "$and": [
                    {"$eq": [{"$dayOfMonth": "$dateOfBirth"}, {"$dayOfMonth": new Date()}]},
                    {"$eq": [{"$month": "$dateOfBirth"}, {"$month": new Date()}]}
                ]
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.send(result)
        });

    } catch (err) {
        console.log("Error", err);
        res.status(422).send({error: "Error in getting employee details"});
    }
};

const countData = async (req, res) => {
    try {
        const create = await Users.aggregate([{$count: "employeeCount"}]);
        res.status(200).send({done: true, data: create})
    } catch (err) {
        console.log(err);
        res.status(422).send({done: false, message: err.message, error: "Error in create category!"})
    }
};
const employee
    = async (req, res) => {
    try {
        const create = await Users.aggregate([{$count: "employeeCount"}]);
        res.status(200).send({done: true, data: create})
    } catch (err) {
        console.log(err);
        res.status(422).send({done: false, message: err.message, error: "Error in create category!"})
    }
};

const generatePdf = async (req, res) => {
    try {

        const data = req.body;
        const documentDefinition = {
            content: [
                {
                    style: 'logo',
                    image: "data:image/png;base64,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\n"
                },
                '\n\n2004, Silver Business Point, VIP Cir, near Royal Square, Uttran, Surat, Gujarat 394101\n\n',
                {text: 'Salary Slip', style: 'header', alignment: "center"},


                `Employee Name : ${data.employeeName}\n\n`,
                `Designation: ${data.designation}\n\n`,
                `Month/Year: ${data.month}/${data.year}\n\n`,
                {
                    style: 'tableExample',
                    table: {
                        widths: [100, 400],
                        body: [
                            [{text: 'Earning', alignment: "left"}, ''],
                            ['Net Salary\n', {text: data.salary, alignment: "right"}],
                            ['\n', '\n'],
                            [{text: 'Total', style: 'Total', alignment: "left"}, {
                                text: data.salary,
                                style: 'Total',
                                alignment: "right"
                            }],
                        ]
                    }
                },

                {text: '\n\n\nSignature of the Employee : __________________________                Director:'},

            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 0, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                },
                Total: {
                    bold: true
                },
                logo: {
                    alignment: 'center'
                }
            },
            defaultStyle: {
                // alignment: 'justify'
            }
        };
        const pdfDoc = pdfMake.createPdf(documentDefinition);
        pdfDoc.getBase64((data) => {
            res.writeHead(200);
            const download = Buffer.from(data.toString('utf-8'), 'base64');
            res.end(download);
        });
    } catch (err) {
        console.log(err);
        res.status(422).send({done: false, message: err.message, error: "Error in create category!"})
    }
};

export default generateControllers(Users, {
    ProfileData, UpdateProfileData, CheckBirthday,countData, generatePdf
});
