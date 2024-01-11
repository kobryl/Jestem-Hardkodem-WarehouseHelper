using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using UnityEngine;
using static System.Net.Mime.MediaTypeNames;


public class NewBehaviourScript : MonoBehaviour
{
    [SerializeField]
    GameObject parent;
    [SerializeField]
    GameObject[,] cubes;

    [SerializeField]
    Material pathMaterial;

    [SerializeField]
    bool saveFile = false;

    [SerializeField]
    bool loadFile = false;

    string saveFileLocation = "C:/Unity/saveFile";
    public float width = 0.5f;
    public float height = 0.237f;
    public int sizeWidth = 30;
    public int sizeHeight = 62;
    public float offset = 0.0f;


    // Start is called before the first frame update
    void Start()
    {
        foreach (Transform child in transform)
        {
            GameObject.Destroy(child.gameObject);
        }
        cubes = new GameObject[sizeWidth, sizeHeight];
        for (int i = 0; i < sizeWidth; i++)
            for (int j = 0; j < sizeHeight; j++)
            {
                cubes[i, j] = GameObject.CreatePrimitive(PrimitiveType.Cube);
                cubes[i, j].transform.SetParent(parent.transform);
                cubes[i, j].transform.localPosition = new Vector3(width * i + (i > 10 ? offset : 0), height * j, 0);
                cubes[i, j].transform.localScale = new Vector3(0.1f, 0.1f, 0);
                cubes[i, j].AddComponent<click>();
                cubes[i, j].name += " " + j + " " + i;


                GameObject arrow = GameObject.CreatePrimitive(PrimitiveType.Cube);
                arrow.transform.SetParent(cubes[i, j].transform);
                arrow.transform.localPosition = new Vector3(-0.75f, 0, 0);
                arrow.transform.localScale = new Vector3(0.4f, 0.4f, 0);
                arrow.name = "left";

                arrow = GameObject.CreatePrimitive(PrimitiveType.Cube);
                arrow.transform.SetParent(cubes[i, j].transform);
                arrow.transform.localPosition = new Vector3(0.75f, 0, 0);
                arrow.transform.localScale = new Vector3(0.4f, 0.4f, 0);
                arrow.name = "right";

                arrow = GameObject.CreatePrimitive(PrimitiveType.Cube);
                arrow.transform.SetParent(cubes[i, j].transform);
                arrow.transform.localPosition = new Vector3(0, 0.75f, 0);
                arrow.transform.localScale = new Vector3(0.4f, 0.4f, 0);
                arrow.name = "up";

                arrow = GameObject.CreatePrimitive(PrimitiveType.Cube);
                arrow.transform.SetParent(cubes[i, j].transform);
                arrow.transform.localPosition = new Vector3(0, -0.75f, 0);
                arrow.transform.localScale = new Vector3(0.4f, 0.4f, 0);
                arrow.name = "down";

            }


        //GameObject cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
        //cube.transform.SetParent(parent.transform);
    }
    // Update is called once per frame
    bool inBounds(int y, int x) 
    {
        if ( y < 0 || x < 0 ) return false;
        if (y >= sizeHeight ||  x >= sizeWidth ) return false;
        return true;
    }
    void loadState()
    {
        using (TextReader reader = File.OpenText(saveFileLocation))
        {
            for(int i = 0; i < sizeHeight; i++)
            {
                for(int j  = 0; j < sizeWidth; j++)
                {
                    string text = reader.ReadLine();
                    string[] bits = text.Split(' ');
                    int y = int.Parse(bits[0]);
                    int x = int.Parse(bits[1]);
                    bool left = (bits[2] == "1" ? true : false);
                    bool up = (bits[3] == "1" ? true : false);
                    bool right = (bits[4] == "1" ? true : false);
                    bool down = (bits[5] == "1" ? true : false);

                    foreach (Transform child in cubes[x, y].transform)
                    {
                        if (child.name == "up" && !up)
                            Destroy(child.gameObject);
                        else if (child.name == "down" && !down)
                            Destroy(child.gameObject);
                        else if (child.name == "left" && !left)
                            Destroy(child.gameObject);
                        else if (child.name == "right" && !right)
                            Destroy(child.gameObject);
                    }
                }
            }
        }
        using (TextReader reader = File.OpenText("C:/Unity/outputPath"))
        {
            string text;
            while ((text = reader.ReadLine()) != null)
            {
                string[] bits = text.Split(' ');
                int y = int.Parse(bits[0]);
                int x = int.Parse(bits[1]);
                cubes[x, y].GetComponent<Renderer>().material = pathMaterial;
            }
        }
        using (TextReader reader = File.OpenText("C:/Unity/tagFile"))
        {
            string text;
            while ((text = reader.ReadLine()) != null)
            {
                string[] bits = text.Split(' ');
                Debug.Log(bits[0] + " " + bits[1] + " " + bits[2]);
                int x = int.Parse(bits[1]);
                int y = int.Parse(bits[2]);
                cubes[x, y].name += bits[0];
            }
        }
    }
    void saveState()
    {
        List<(int, int)>[] edges = new List<(int, int)>[sizeHeight * sizeWidth];
        for (int i = 0; i < sizeHeight * sizeWidth; i++)
            edges[i] = new List<(int, int)>();

        File.WriteAllText(saveFileLocation, string.Empty);
        for (int j = 0; j < sizeHeight; j++)
        {
            for (int i = 0; i < sizeWidth; i++)
            {
                bool left = false;
                bool right = false;
                bool up = false;
                bool bottom = false;

                foreach (Transform child in cubes[i, j].transform)
                {
                    if (child.name == "up")
                        up = true;
                    if (child.name == "down")
                        bottom = true;
                    if (child.name == "left")
                        left = true;
                    if (child.name == "right")
                        right = true;
                }


                StreamWriter file = new StreamWriter(saveFileLocation, true);
                string s = "" + j + " " + i + " " + cubes[i, j].transform.localPosition.x + " " + cubes[i, j].transform.localPosition.y;
                file.WriteLine(s);
                file.Close();
            }
        }
    }

    void Update()
    {
        if (saveFile)
        {
            saveFile = false;
            saveState();
        }
    
        if(loadFile)
        {
            loadFile = false;
            loadState();
        }
    }
}
