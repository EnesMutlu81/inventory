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
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
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
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
}
