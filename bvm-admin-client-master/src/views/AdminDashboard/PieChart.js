// import React from "react";
// import Chart from "react-google-charts";
// import {Collapse} from "reactstrap";
// import {Card, CardBody} from "reactstrap";
//
// const PieChart = (props) => {
//   const {collapse, worksData} = props;
//   const PieChart = "PieChart";
//   return (
//     <Collapse isOpen={collapse}>
//       <div className="row">
//         {worksData && worksData.map((v, i) => (
//           <Card key={i} className="cusPie">
//             <CardBody>
//               <div key={i} className="col-4">
//                 <Chart
//                   chartType="PieChart"
//                   data={[["Hours", "Month"], ["Works-Hours", v.hours]]}
//                   // options={pieOptions}
//                   graph_id={PieChart + i}
//                   legend_toggle
//                 />
//               </div>
//             </CardBody>
//           </Card>
//
//         ))}
//       </div>
//     </Collapse>
//   )
// };
//
// export default PieChart;
