import java.util.HashMap;
class UserSolution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] { -1, -1 }; // Return -1,-1 if no solution
    }

    public static void main(String[] args) {
        UserSolution userSolution = new UserSolution();

        // Example test cases
        int[] nums1 = {3, 3};
        int target1 = 6;
        int[] result1 = userSolution.twoSum(nums1, target1);
        System.out.println("Test case 1: " + java.util.Arrays.toString(result1)); // Expected output: [0, 1]

        int[] nums2 = {1, 5, 9, 10, 12};
        int target2 = 14;
        int[] result2 = userSolution.twoSum(nums2, target2);
        System.out.println("Test case 2: " + java.util.Arrays.toString(result2)); // Expected output: [2, 3]

        int[] nums3 = {-1, -2, -3, -4, -5};
        int target3 = -8;
        int[] result3 = userSolution.twoSum(nums3, target3);
        System.out.println("Test case 3: " + java.util.Arrays.toString(result3)); // Expected output: [2, 4]
    }
}
