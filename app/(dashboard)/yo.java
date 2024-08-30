/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode l = head;
        ListNode r = head;
        ListNode prev = head;
        ListNode ahead = null;
        ListNode temp = head;
        int c = 1;
        while(temp != null){
            if(c==left)
            l = temp;
            if(c==right){
            r = temp;
            }
            if(c+1==left)
            prev = temp;
            if(c-1 == right){
            ahead = temp;
                System.out.println(ahead.val);
            }
            temp = temp.next;
            c++;
        }
        temp = l;
        ListNode p = null;
        while(temp!=ahead){
            ListNode currp1 = temp.next;
            temp.next = p;
            p = temp;
            temp = currp1;
        }
        prev.next = p;
        l.next = ahead;
        // p = p.next;
        return head;
    }
}