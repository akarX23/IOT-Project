import dbConnect from "helpers/dbConnection";
import { find } from "Models/PinFin";
import Image from "next/image";

import formula1 from "assets/formula1.jpeg";
import formula2 from "assets/formula2.jpeg";

export async function getServerSideProps() {
  await dbConnect();

  let pinFin = await find();

  return {
    props: {
      data: JSON.parse(JSON.stringify(pinFin)),
    },
  };
}

export default function Home({ data }) {
  console.log(data);
  let tempArr = data[0]?.temperatures || [];

  return (
    <div className="mt-8 mx-24 h-full">
      <h1 className="text-3xl text-white font-bold mb-8">
        Pin Fin Apparatus (Natural Convection) experimental calculations
      </h1>
      <table className="w-full table-auto border-collapse border ">
        <thead>
          <tr className="border-b border-white">
            <th className="p-3 text-lg border text-white">Sl. no</th>
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
          {data.map((row, i) => (
            <tr key={i} className="text-center">
              <td className="p-3 text-lg border text-white">{i + 1}</td>
              <td className="p-3 text-lg border text-white">{row.voltage}</td>
              <td className="p-3 text-lg border text-white">{row.current}</td>
              <td className="p-3 text-lg border text-white">{row.heat}</td>
              <td className="p-3 text-lg border text-white">{row.diameter}</td>
              <td className="p-3 text-lg border text-white">{row.length}</td>
              {row.temperatures.map((temp, j) => (
                <td className="p-3 text-lg border text-white" key={j}>
                  {temp}
                </td>
              ))}
              <td className="p-3 text-lg border text-white">{row.atmTemp}</td>
              <td className="p-3 text-lg border text-white">
                {Number.parseFloat(row.heatCoefficient).toFixed(5)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center flex flex-col my-8">
        <Image src={formula1} />
        <Image src={formula2} />
      </div>
    </div>
  );
}
