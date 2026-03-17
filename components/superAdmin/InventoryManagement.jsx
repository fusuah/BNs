"use client";
import { useState, useEffect } from "react";
import { Plus, Package } from "lucide-react";

export default function InventoryManagement() {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: "", quantity: 0, unit: "box", category: "Vitamin" });

  useEffect(() => {
    fetch("/api/superAdmin/inventory")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const handleAddItem = async () => {
    const res = await fetch("/api/superAdmin/inventory", {
      method: "POST",
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      const added = await res.json();
      setItems([...items, added]);
      setShowAdd(false);
      setNewItem({ itemName: "", quantity: 0, unit: "box", category: "Vitamin" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Package size={20} /> Vitamin Inventory
        </h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
          <input
            placeholder="Item Name (e.g. Vitamin A)"
            className="w-full mb-2 p-2 rounded border"
            value={newItem.itemName}
            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
          />
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Qty"
              className="w-1/2 p-2 rounded border"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
            <select
              className="w-1/2 p-2 rounded border"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            >
              <option value="box">Box</option>
              <option value="bottle">Bottle</option>
              <option value="pcs">Pcs</option>
            </select>
          </div>
          <button onClick={handleAddItem} className="w-full bg-green-600 text-white py-1 rounded">Save</button>
        </div>
      )}

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <p className="font-semibold text-gray-800">{item.itemName}</p>
              <p className="text-xs text-gray-500">{item.category}</p>
            </div>
            <div className="text-right">
              <span className={`font-bold ${item.quantity < 10 ? "text-red-500" : "text-green-600"}`}>
                {item.quantity}
              </span>
              <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}