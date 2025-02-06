import java.util.*;
public class Solution {
    // Function to check if a given number is a palindrome
    public boolean isPalindrome(int number) {
        if (number < 0) return false; // Negative numbers are not palindromes

        int original = number;
        int reversed = 0;

        while (number != 0) {
            int lastDigit = number % 10;
            reversed = reversed * 10 + lastDigit;
            number /= 10;
        }

        return original == reversed;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        int test1 = 121;
        int test2 = -121;
        int test3 = 10;

        System.out.println( solution.isPalindrome(test1));
        System.out.println( solution.isPalindrome(test2));
        System.out.println(solution.isPalindrome(test3));
    }
}