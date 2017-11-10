import React from 'react';
import { VictoryStack, VictoryArea, VictoryLine, VictoryTheme, VictoryContainer, VictoryChart, VictoryLabel, VictoryLegend } from 'victory';

const AreaChart = (props: {
  data: Array<survivalStats>,
  viewSize: number
}) => {
  console.log(props.data);
  return (
    <div className="Chart">
      {/* <svg viewBox={`0 0 ${props.viewSize*3} ${props.viewSize}`}> */}
      <VictoryChart
        height={props.viewSize}
        width={props.viewSize * 16 / 9}
        // containerComponent={<VictoryContainer responsive={false} />}
        theme={VictoryTheme.material}
        style={{
              labels: { fill: "black" }
            }}
            scale={{x:"time"}}
      >
        <VictoryLegend
          title="Legend"
          centerTitle
          height={props.viewSize}
          orientation="vertical"
          data={props.data.map(item => ({ name: item.type.reduce((acc,curr) => acc.concat('/').concat(curr)) }))}
          style={{
              labels: { fill: "black" }
            }}
        />
        <VictoryStack>
        {props.data.map(series => (
          <VictoryArea
            key={`${series.index}${series.bin}`}
            data={
              series.data.map(item => {
                return { x: new Date(item.start), y: item.count /*, label: `${Math.round(series.count / props.total * 1000) / 10}%` */ }
              })
            }
          />
        ))}
        </VictoryStack>
      </VictoryChart>
      {/* </svg> */}
      <table /* className="rwd-table" */>
        <tbody>
          <tr>
            <th />
            {props.data[0].data.map(item => (
              <th key={item.bin}>{item.bin}</th>
            ))}
          </tr>
          {props.data.filter(item => item.type.includes('company') || item.type.includes('npe')).map(series => (
            <tr key={series.type}>
              <td>{series.type}</td>
              {series.data.map(item => (
                <td key={item.bin}>{item.count}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AreaChart;