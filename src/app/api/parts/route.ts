import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { computeStatus } from "@/lib/utils";

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection("spare_parts")
      .find()
      .sort({ lastUpdated: -1 })
      .toArray();

    // MongoDB _id → id dönüşümü
    const parts = docs.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    return NextResponse.json(parts);
  } catch {
    return NextResponse.json({ error: "Veriler alınamadı" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partNumber, name, category, quantity, unitPrice } = body;

    if (!partNumber || !name || !category || quantity == null || !unitPrice) {
      return NextResponse.json({ error: "Eksik alan var" }, { status: 400 });
    }

    const doc = {
      partNumber,
      name,
      category,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      status: computeStatus(Number(quantity)),
      lastUpdated: new Date().toISOString(),
    };

    const db = await getDb();
    const result = await db.collection("spare_parts").insertOne(doc);

    return NextResponse.json(
      { id: result.insertedId.toString(), ...doc },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("DEBUG POST ERROR:", error);
    return NextResponse.json({ error: "Parça eklenemedi", detail: error.message }, { status: 500 });
  }
}
