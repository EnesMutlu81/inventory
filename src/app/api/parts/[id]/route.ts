import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { computeStatus } from "@/lib/utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { partNumber, name, category, quantity, unitPrice } = body;

    const update = {
      partNumber,
      name,
      category,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      status: computeStatus(Number(quantity)),
      lastUpdated: new Date().toISOString(),
    };

    const db = await getDb();
    await db
      .collection("spare_parts")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });

    return NextResponse.json({ id, ...update });
  } catch (error: any) {
    console.error("DEBUG PUT ERROR:", error);
    return NextResponse.json({ error: "Güncellenemedi", detail: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const db = await getDb();
    await db
      .collection("spare_parts")
      .deleteOne({ _id: new ObjectId(id) });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("DEBUG DELETE ERROR:", error);
    return NextResponse.json({ error: "Silinemedi", detail: error.message }, { status: 500 });
  }
}
