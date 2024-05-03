import heapq
from collections import namedtuple


Node = namedtuple('Node', ['state', 'parent', 'action', 'cost', 'heuristic'])

def a_star(start_state, goal_state, successors, heuristic):
    start_node = Node(state=start_state, parent=None, action=None, cost=0, heuristic=heuristic(start_state, goal_state))
    frontier = [(start_node.cost + start_node.heuristic, start_node)]
    explored = set()
    
    while frontier:
        _, current_node = heapq.heappop(frontier)
        
        if current_node.state == goal_state:
            return build_path(current_node), current_node.cost
        
        if current_node.state not in explored:
            explored.add(current_node.state)
            
            for action, child_state, action_cost in successors(current_node.state):
                if child_state not in explored:
                    child_node = Node(state=child_state, parent=current_node, action=action,
                                      cost=current_node.cost + action_cost, heuristic=heuristic(child_state, goal_state))
                    heapq.heappush(frontier, (child_node.cost + child_node.heuristic, child_node))
    
    return None, float('inf') 
def build_path(node):
    path = []
    while node.parent:
        path.append((node.action, node.state))
        node = node.parent
    path.reverse()
    return path


def grid_successors(state):
    x, y = state
    successors = []
    for dx, dy, cost in [(-1, 0, 1), (1, 0, 1), (0, -1, 1), (0, 1, 1)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < 5 and 0 <= ny < 5: 
            successors.append(((dx, dy), (nx, ny), cost))
    return successors

def euclidean_distance(state, goal_state):
    x1, y1 = state
    x2, y2 = goal_state
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5

start_state = (0, 0)
goal_state = (4, 4)
path, path_cost = a_star(start_state, goal_state, grid_successors, euclidean_distance)

if path:
    print("Path found:", path)
    print("Path cost:", path_cost)
else:
    print("No path found from", start_state, "to", goal_state)
