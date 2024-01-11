using CromulentBisgetti.ContainerPacking.Algorithms;
using CromulentBisgetti.ContainerPacking.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace CromulentBisgetti.ContainerPacking
{
    class Program
    {
        static void Main(string[] args)
        {
            List<Container> containers = new List<Container>();
            containers.Add(new Container(0, 800, 1200, 1856));

            List<Item> itemsToPack = new List<Item>();
            string[] orders = Directory.GetFiles("data/Zamowienia", "*.txt");
            foreach (string order in orders)
            {
                string[] lines = File.ReadAllLines(order);
                foreach (string line in lines)
                {
                    string[] data = line.Split(' ');
                    if (data.Length > 0)
                    {
                        int id = int.Parse(data[0]);
                        int dim1 = int.Parse(data[2]);
                        int dim2 = int.Parse(data[3]);
                        int dim3 = int.Parse(data[4]);
                        int quantity = int.Parse(data[6]);
                        itemsToPack.Add(new Item(id, dim1, dim2, dim3, quantity));
                    }
                }
            }
            
            List<int> algorithms = new List<int>();
            algorithms.Add((int)AlgorithmType.EB_AFIT);

            List<ContainerPackingResult> result = PackingService.Pack(containers, itemsToPack, algorithms);
            List<Item> resultItems = result[0].AlgorithmPackingResults[0].PackedItems;
            string res = "";
            StreamWriter sw = new StreamWriter("data/pallet.txt");
            foreach (Item item in resultItems)
            {
                Item oldItem = itemsToPack.Find(i => i.ID == item.ID);
                decimal dx = oldItem.Dim1 - item.PackDimX;
                decimal dz = oldItem.Dim3 - item.PackDimZ;
                decimal dy = oldItem.Dim2 - item.PackDimY;
                string up = "";
                decimal max_diff = Math.Max(Math.Abs(dx), Math.Max(Math.Abs(dz), Math.Abs(dy)));
                if (max_diff == Math.Abs(dx))
                {
                    if (dx > 0) up = "+x";
                    else up = "-x";
                }
                else if (max_diff == Math.Abs(dz))
                {
                    if (dx > 0) up = "+z";
                    else up = "-z";
                }
                else if (max_diff == Math.Abs(dy))
                {
                    if (dx > 0) up = "+y";
                    else up = "-y";
                }
                sw.WriteLine(item.ID + ", " + item.CoordX.ToString() + ", " + item.CoordZ.ToString() + ", " + item.CoordY.ToString() + ", " + item.PackDimX.ToString() + ", " + item.PackDimZ.ToString() + ", " + item.PackDimY.ToString() + ", '" + up + "\n");
            }
            sw.Flush();
            sw.Close();

        }
    }
}
