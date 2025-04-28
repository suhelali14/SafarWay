import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { toast } from 'react-hot-toast';
import { Search, MessageSquare, XCircle } from 'lucide-react';


interface Ticket {
  id: string;
  subject: string;
  description: string;
  customerName: string;
  customerEmail: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  content: string;
  sender: 'customer' | 'agent';
  senderName: string;
  createdAt: string;
}

export const AgencySupportPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/agency/support/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/agency/support/tickets/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update ticket status');

      setTickets(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, status: status as Ticket['status'] } : ticket
      ));
      toast.success('Ticket status updated successfully');
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket status');
    }
  };

  const handlePriorityChange = async (id: string, priority: string) => {
    try {
      const response = await fetch(`/api/agency/support/tickets/${id}/priority`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ priority })
      });

      if (!response.ok) throw new Error('Failed to update ticket priority');

      setTickets(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, priority: priority as Ticket['priority'] } : ticket
      ));
      toast.success('Ticket priority updated successfully');
    } catch (error) {
      console.error('Error updating ticket priority:', error);
      toast.error('Failed to update ticket priority');
    }
  };

  // const _handleAssignTicket = async (id: string, agentId: string) => {
  //   try {
  //     const response = await fetch(`/api/agency/support/tickets/${id}/assign`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       },
  //       body: JSON.stringify({ agentId })
  //     });

  //     if (!response.ok) throw new Error('Failed to assign ticket');

  //     setTickets(tickets.map(ticket => 
  //       ticket.id === id ? { ...ticket, assignedTo: agentId } : ticket
  //     ));
  //     toast.success('Ticket assigned successfully');
  //   } catch (error) {
  //     console.error('Error assigning ticket:', error);
  //     toast.error('Failed to assign ticket');
  //   }
  // };

  const handleSendReply = async (ticketId: string) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      const response = await fetch(`/api/agency/support/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: replyMessage })
      });

      if (!response.ok) throw new Error('Failed to send reply');

      const newMessage = await response.json();
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              messages: [...ticket.messages, newMessage],
              updatedAt: new Date().toISOString()
            } 
          : ticket
      ));
      setReplyMessage('');
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'text-blue-600';
      case 'in_progress':
        return 'text-yellow-600';
      case 'resolved':
        return 'text-green-600';
      case 'closed':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading support tickets...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Support | SafarWay Agency</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Support Tickets</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <TableRow 
                          key={ticket.id}
                          className={selectedTicket?.id === ticket.id ? 'bg-gray-50' : ''}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <TableCell className="font-medium">#{ticket.id.slice(0, 8)}</TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>
                            <div>{ticket.customerName}</div>
                            <div className="text-sm text-gray-500">{ticket.customerEmail}</div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={ticket.status}
                              onValueChange={(value) => handleStatusChange(ticket.id, value)}
                            >
                              <SelectTrigger className={`w-[130px] ${getStatusColor(ticket.status)}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={ticket.priority}
                              onValueChange={(value) => handlePriorityChange(ticket.id, value)}
                            >
                              <SelectTrigger className={`w-[130px] ${getPriorityColor(ticket.priority)}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {selectedTicket && (
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Ticket Details</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTicket(null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Subject</h3>
                    <p>{selectedTicket.subject}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-gray-600">{selectedTicket.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Customer</h3>
                    <p>{selectedTicket.customerName}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.customerEmail}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Category</h3>
                    <p>{selectedTicket.category}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Messages</h3>
                    <div className="space-y-4 mt-2 max-h-[300px] overflow-y-auto">
                      {selectedTicket.messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.sender === 'agent' 
                              ? 'bg-blue-50 ml-4' 
                              : 'bg-gray-50 mr-4'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{message.senderName}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="mb-2"
                    />
                    <Button 
                      onClick={() => handleSendReply(selectedTicket.id)}
                      className="w-full"
                    >
                      Send Reply
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 