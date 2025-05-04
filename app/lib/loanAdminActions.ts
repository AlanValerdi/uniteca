export async function approveLoan(loanId: string) {
    try {
      const res = await fetch(`/api/approve-loan?loanId=${loanId}`, {
        method: 'PATCH',
      });
  
      if (!res.ok) {
        throw new Error('Failed to approve loan');
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error approving loan:', error);
      throw error;
    }
  }
  
  export async function rejectLoan(loanId: string) {
    try {
      const res = await fetch(`/api/reject-loan?loanId=${loanId}`, {
        method: 'PATCH',
      });
  
      if (!res.ok) {
        throw new Error('Failed to reject loan');
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error rejecting loan:', error);
      throw error;
    }
  }
  
  export async function renewLoan(loanId: string) {
    try {
      const res = await fetch(`/api/renew-loan?loanId=${loanId}`, {
        method: 'PATCH',
      });
  
      if (!res.ok) {
        throw new Error('Failed to renew loan');
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error renewing loan:', error);
      throw error;
    }
  }

  export async function returnBook(loanId: string) {
    try {
      const res = await fetch(`/api/return-book?loanId=${loanId}`, {
        method: 'PATCH',
      });
  
      if (!res.ok) {
        throw new Error('Failed to return the book');
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error returning the book:', error);
      throw error;
    }
  }

export function formatDateTime(dateString: string | number | Date) {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  