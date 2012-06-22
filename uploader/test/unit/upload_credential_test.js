var uploadCredential = require('../../lib/upload_credential');

describe('Upload Credential', function(){
  describe('#create', function(){
    it('should create a MD5 hash', function(){
      uploadCredential.create('1339976490').should.equal('873d7ae7d18c3b072bf88d2abc1d6464');
    });
  });
  describe('#isValid', function(){
    it('should return true for a valid credential', function(){
      uploadCredential.isValid('873d7ae7d18c3b072bf88d2abc1d6464', '1339976490').should.be.true;
    });
  });
});
