import dbConnect from "helpers/dbConnection";
import { find } from "Models/PinFin";
import Image from "next/image";

import { useState } from "react";

import formula1 from "assets/formula1.jpeg";
import formula2 from "assets/formula2.jpeg";
import { sendDataForCalculation } from "helpers/APIs/calculate";

export async function getServerSideProps() {
  await dbConnect();

  let pinFin = await find();

  return {
    props: {
      data: JSON.parse(JSON.stringify(pinFin)),
    },
  };
}

let inputFields = [
  {
    name: "voltage",
    title: "Voltage",
  },
  {
    name: "current",
    title: "Current",
  },
  {
    name: "atmTemp",
    title: "Atmospheric Temperature",
  },
  {
    name: "diameter",
    title: "Diameter",
  },
  {
    name: "length",
    title: "Length",
  },
];

export default function Home({ data }) {
  let tempArr = data[0]?.temperatures || [];

  const [selectedId, setSelectedId] = useState(null);
  const [values, setValues] = useState({
    voltage: "",
    current: "",
    atmTemp: "",
    diameter: "",
    length: "",
  });
  const [currentData, setCurrentData] = useState(data);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (selectedId === null) {
      alert("Please select a row to edit");
      return;
    }

    // check if all fields are filled
    let isValid = true;
    for (let i = 0; i < inputFields.length; i++) {
      if (values[inputFields[i].name] === "") {
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      alert("Please fill all fields");
      return;
    }

    try {
      let resultRow = await sendDataForCalculation(values, selectedId);

      // replace the selected row with the new one
      let newData = currentData.map((row) => {
        if (row._id === selectedId) {
          return resultRow;
        }
        return row;
      });
      setCurrentData(newData);
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
      return;
    }
  };

  return (
    <div className="mt-8 mx-24 h-full">
      <h1 className="text-3xl text-white font-bold mb-3">
        Pin Fin Apparatus (Natural Convection) experimental calculations
      </h1>
      <h3 className="text-lg text-white mb-8">
        Please select the row you want to edit and fill the fields with the new
        values and click the &quot;Calculate&quot; button to update the
        calculations.
      </h3>
      <form className="flex flex-wrap mt-4 mb-8 items-end" onSubmit={onSubmit}>
        {inputFields.map((inputData, i) => (
          <div key={i} className="mr-10">
            <p className="mb-2 text-lg text-white font-bold">
              {inputData.title}
            </p>
            <input
              name={inputData.name}
              type="number"
              className="p-2 border-none outline-none"
              disabled={selectedId === null}
              value={values[inputData.name]}
              onChange={(e) => {
                setValues({ ...values, [inputData.name]: e.target.value });
              }}
            />
          </div>
        ))}

        <button className="p-2 bg-orange-400 text-black font-bold">
          Calculate
        </button>
      </form>
      <table className="w-full table-auto border-collapse border ">
        <thead>
          <tr className="border-b border-white">
            <th className="p-3 text-lg border text-white">Select</th>
            <th className="p-3 text-lg border text-white">
              Voltage <br /> (V)
            </th>
            <th className="p-3 text-lg border text-white">
              Current (I)
              <br />
              (A)
            </th>
            <th className="p-3 text-lg border text-white">
              Heat (Q)
              <br />
              (W)
            </th>
            <th className="p-3 text-lg border text-white">
              Diameter (D)
              <br />
              (m)
            </th>
            <th className="p-3 text-lg border text-white">
              Length (L)
              <br />
              (m)
            </th>
            {tempArr.map((_, i) => (
              <th className="p-3 text-lg border text-white" key={i}>
                T<sub>{i + 1}</sub>
                <br />
                (&#8451;)
              </th>
            ))}
            <th className="p-3 text-lg border text-white">
              Atmospheric Temp (T<sub>atm</sub>)<br />
              (&#8451;)
            </th>
            <th className="p-3 text-lg border text-white">
              Heat Coefficient (h)
              <br />
              (W/m<sup>2</sup>&#8209;K)
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr
              key={row._id}
              className={`text-center cursor-pointer ${
                selectedId === row._id ? "bg-green-700" : ""
              }`}
              onClick={() => setSelectedId(row._id)}
            >
              <td className="p-3 text-lg border text-white">
                <input
                  type="radio"
                  checked={selectedId === row._id}
                  onChange={() => setSelectedId(row._id)}
                  name="row"
                />
              </td>
              <td className="p-3 text-lg border text-white">
                {row.voltage || "-"}
              </td>
              <td className="p-3 text-lg border text-white">
                {row.current || "-"}
              </td>
              <td className="p-3 text-lg border text-white">
                {row.heat || "-"}
              </td>
              <td className="p-3 text-lg border text-white">
                {row.diameter || "-"}
              </td>
              <td className="p-3 text-lg border text-white">
                {row.length || "-"}
              </td>
              {row.temperatures.map(
                (temp, j) =>
                  j < tempArr.length && (
                    <td className="p-3 text-lg border text-white" key={j}>
                      {temp}
                    </td>
                  )
              )}
              <td className="p-3 text-lg border text-white">
                {row.atmTemp || "-"}
              </td>
              <td className="p-3 text-lg border text-white">
                {row.heatCoefficient
                  ? Number.parseFloat(row.heatCoefficient).toFixed(5)
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center flex flex-col my-8 w-3/4 mx-auto">
        <Image src={formula1} alt={"formula"} />
        <Image src={formula2} alt={"formula"} />
      </div>
    </div>
  );
}
