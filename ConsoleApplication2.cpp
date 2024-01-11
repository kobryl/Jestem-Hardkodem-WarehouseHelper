// ConsoleApplication2.cpp : Ten plik zawiera funkcję „main”. W nim rozpoczyna się i kończy wykonywanie programu.
//

#include <iostream>
#include <vector>
#include <fstream>
#include <queue>
#include <unordered_map>

const int width = 30;
const int height = 62;

int sortMode = 0;
std::string filepath;
struct product {
    int weight, quantity, width, height, length, productID;

    std::string productKey;

    bool operator < (const product& p) {
        if (sortMode == 0)
            return weight < p.weight;
        else if (sortMode == 1)
            return quantity < p.quantity;
        else
            return width * height * length < p.width * p.height * p.length;
    }

public:
    product() {
        weight = 0;
        quantity = 0;
        width = 0;
        height = 0;
        length = 0;
        productKey = "";
        productID = 0;
    }

    product(int weight, int quantity, int width, int height, int length, std::string productKey, int productID) {
        this->weight = weight;
        this->quantity = quantity;
        this->width = width;
        this->height = height;
        this->length = length;
        this->productKey = productKey;
        this->productID = productID;
    }
};

struct node {
    bool left;
    bool up;
    bool right;
    bool bottom;

public:
    node(bool left, bool up, bool right, bool bottom) {
        this->left = left;
        this->up = up;
        this->right = right;
        this->bottom = bottom;
    }

    node() {
        this->left = false;
        this->up = false;
        this->right = false;
        this->bottom = false;
    }
};

int CoordTo1D(int y, int x) {
    return y * width + x;
}

void  CoordTo2D(int idx, int& y, int& x) {
    y = idx / width;
    x = idx - y * width;
}


const int totalSize = height * width;
node nodes[totalSize];
int path[totalSize];

int distance[totalSize];
bool visited[totalSize];
int prev[totalSize];

std::vector<product> productsToFind;
std::deque<std::pair<int, int>> route;
std::deque<std::pair<int, int>> tmp_route;
std::unordered_map<std::string, int> keyToIdx;



bool inBounds(int idx){
    if (idx < 0 || idx >= totalSize) return false;
    return true;
}


void bfs(int idx, int targetIdx) {
    std::vector<int> usedCandidates;
    for (int i = 0; i < totalSize; i++) {
        prev[i] = 0;
        visited[i] = false;
    };
    prev[idx] = -1;
    std::queue<int> q;
    q.push(idx);

    while (!q.empty()) {
        int curr_idx = q.front();
        q.pop();
        visited[curr_idx] = true;
        if (inBounds(curr_idx - 1) && nodes[curr_idx].left && !visited[curr_idx - 1]) {
            prev[curr_idx - 1] = curr_idx;
            distance[curr_idx - 1] = distance[curr_idx] + 1;
            q.push(curr_idx - 1);
        }

        if (inBounds(curr_idx + 1) && nodes[curr_idx].right && !visited[curr_idx + 1]) {
            prev[curr_idx + 1] = curr_idx;
            distance[curr_idx + 1] = distance[curr_idx] + 1;
            q.push(curr_idx + 1);
        }

        if (inBounds(curr_idx + width) && nodes[curr_idx].up && !visited[curr_idx + width]) {
            prev[curr_idx + width] = curr_idx;
            distance[curr_idx + width] = distance[curr_idx] + 1;
            q.push(curr_idx + width);
        }

        if (inBounds(curr_idx - width) && nodes[curr_idx].bottom && !visited[curr_idx - width]) {
            prev[curr_idx - width] = curr_idx;
            distance[curr_idx - width] = distance[curr_idx] + 1;
            q.push(curr_idx - width);
        }
    }

    int k, p;
    CoordTo2D(targetIdx, k, p);
    tmp_route.push_back(std::pair<int, int>(k, p));
    int _prev = prev[targetIdx];
    while (_prev != -1) {
        CoordTo2D(_prev, k, p);
        tmp_route.push_back(std::pair<int, int>(k, p));
        _prev = prev[_prev];
    }
}


void printRoute() {
    std::ofstream pathOutput("C:/Unity/outputPath");
    for (std::pair<int, int> v : route) {
        int y = v.first;
        int x = v.second;
        std::cout << y << " " << x << "\n";
        pathOutput << y << " " << x << "\n";
    }

    pathOutput.close();
}

void loadItems() {
    std::ifstream file("C:/Unity/tagFile");
    std::string s;
    int y, x;
    while (file >> s >> y >> x) {
        keyToIdx[s] = CoordTo1D(x, y);
    }
    file.close();
    std::string filepath = "C:/Users/Shairys/Downloads/Zamowienie1.txt";
    file.open(filepath);

    int productID, weight, width, length, height, quantity;
    std::string productKey;

    std::string sort_mode;
    file >> sort_mode;
    if (sort_mode == "WEIGHT")
        sortMode = 0;
    else if (sort_mode == "QUANTITY")
        sortMode = 1;
    else
        sortMode = 2;

    while (file >> productID >> weight >> width >> length >> height >> productKey >> quantity) {
        productsToFind.push_back(product(weight, quantity, width, height, length, productKey, productID));
    }
}


int main(int argc, char* argv[])
{
    std::ifstream file("C:/Unity/saveFile");
    std::queue<int> candidates;
    filepath = std::string(argv[1]);
    int y, x, left, up, right, bottom;
    loadItems();

    while (file >> y >> x >> left >> up >> right >> bottom) {
        nodes[CoordTo1D(y, x)] = node(bool(left), bool(up), bool(right), bool(bottom));
    }

    std::sort(productsToFind.begin(), productsToFind.end());
    for (int i = 0; i < productsToFind.size(); i++) {
        if (keyToIdx[productsToFind[i].productKey] == 0)
            continue;
        candidates.push(keyToIdx[productsToFind[i].productKey]);
    }
        
    //candidates.push(keyToIdx["H506A03"]);
    //candidates.push(CoordTo1D(2, 0));
    int last = CoordTo1D(1, 0);
    while (!candidates.empty()) {
        bfs(last, candidates.front());
        last = candidates.front();
        candidates.pop();
        while (tmp_route.size() > 0) {
            if (route.size() > 0 && tmp_route.back() == route.back()) {
                tmp_route.pop_back();
                continue;
            }
            route.push_back(tmp_route.back());
            tmp_route.pop_back();
        }
    }
    printRoute();
}