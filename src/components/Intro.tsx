import { Circle, Layer, Rect, Stage } from 'react-konva'

export default function Intro() {
  return (
    <Stage width={500} height={500}>
      <Layer>
        <Rect width={50} height={50} fill="red" />
        <Circle x={200} y={200} stroke="black" radius={50} />
      </Layer>
    </Stage>
  )
}
