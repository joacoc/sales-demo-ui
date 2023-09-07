import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { body } = request;

    if (body) {
        const content = await request.json();
        const { type } = content;

        switch (type) {
            case "sensor":
                const { target, sensor_id } = content;
                console.log("Sending to: ", process.env.API_ENDPOINT + `/update_sensor?sensor_id=${sensor_id}&target=${target}`)
                fetch(process.env.API_ENDPOINT + `/update_sensor?sensor_id=${sensor_id}&target=${target}`, { method: "POST" })
                return NextResponse.json({});

            default:
                return NextResponse.json({ error: "Invalid request." });
        }
    }
}