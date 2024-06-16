import {Plugin} from "chart.js";

export const customBackgroundColor: Plugin = {
  id: "customBarBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options["backgroundColor"] || 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};
