import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { body } = request;

    if (body) {
        const content = await request.json();
        const { type } = content;

        switch (type) {
            case "sensor": {
                const { target, sensor_id } = content;
                console.log("Sending to: ", process.env.API_ENDPOINT + `/update_sensor?sensor_id=${sensor_id}&target=${target}`);
                // fetch(process.env.API_ENDPOINT + `/update_sensor?sensor_id=${sensor_id}&target=${target}`, { method: "POST" });

                return NextResponse.json({});
            }

            case "resupply": {
                const { booth, ingredient, amount } = content;
                console.log("Sending to: ", process.env.API_ENDPOINT + `/resupply?ingredient_id=${ingredient.id}&amount=${amount}&delivered_to=${booth.id}`);
                // fetch(process.env.API_ENDPOINT + `/resupply?ingredient_id=${ingredient}&amount=${amount}&delivered_to=${booth}`, { method: "POST" });

                return NextResponse.json({});
            }

            case "manufacturing": {
                const { item } = content;
                console.log("Sending to: ", process.env.API_ENDPOINT + `/update_manufacturing?item_id=${item.id}&sensor_id=1`);
                // fetch(process.env.API_ENDPOINT + `/update_manufacturing?item_id=${item.id}&sensor_id=1`, { method: "POST" });

                return NextResponse.json({});
            }

            default:
                return NextResponse.json({ error: "Invalid request." });
        }
    }
}